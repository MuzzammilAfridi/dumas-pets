// src/services/variantService.js

import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

const authHeaders = {
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
};

/*
====================================================
VARIANT SERVICE
====================================================

FLOW:
1. Get all variants of template item
2. Compare attributes
3. Return existing variant if found
4. Else create new variant
5. Return variant item_code

====================================================
*/

/* ====================================================
HELPER → Generate GPV Ratio String
==================================================== */
const generateGpvRatio = ({
  grainPercentage,
  meatPercentage,
}) => {

  // ERPNext currently supports ONLY these values

  if (grainPercentage === 15 && meatPercentage === 80) {
    return "15% Grain 80% Protein 5gm-Veg/100gm ";
  }

  if (grainPercentage === 30 && meatPercentage === 65) {
    return "30% Grain 65% Protein 5gm-Veg/100gm ";
  }

  if (grainPercentage === 50 && meatPercentage === 45) {
    return "50% Grain 45% Protein 5gm-Veg/100gm ";
  }

  throw new Error(
    "This Grain/Protein combination is not configured in ERPNext"
  );
};

/* ====================================================
HELPER → Compare Variant Attributes
==================================================== */
const isMatchingVariant = (
  variantAttributes,
  quantity,
  grain,
  gpvRatio
) => {
  const quantityMatch = variantAttributes.find(
    (a) =>
      a.attribute === "Quantity" &&
      a.attribute_value === quantity
  );

  const grainMatch = variantAttributes.find(
    (a) =>
      a.attribute === "Grain" &&
      a.attribute_value === grain
  );

  const gpvMatch = variantAttributes.find(
    (a) =>
      a.attribute === "G P V Ratio" &&
      a.attribute_value === gpvRatio
  );

  return quantityMatch && grainMatch && gpvMatch;
};

/* ====================================================
MAIN FUNCTION
==================================================== */
export const findOrCreateVariant = async ({
  templateItem,
  quantity,
  grain,
  grainPercentage,
  meatPercentage,
}) => {
  try {
    /*
    ====================================================
    STEP 1 → Generate ERPNext GPV Ratio
    ====================================================
    */

    const gpvRatio = generateGpvRatio({
      grainPercentage,
      meatPercentage,
      quantity,
    });

    console.log("GENERATED GPV RATIO:", gpvRatio);

    /*
    ====================================================
    STEP 2 → Get Existing Variants
    ====================================================
    */

const variantsRes = await axios.get(
  `${API}/api/resource/Item?fields=["*"]`,
  authHeaders
);

const allItems = variantsRes.data.data || [];

console.log("ALL ITEMS:", allItems);

const variants = allItems.filter(
  (item) =>
    item.variant_of &&
    item.variant_of.trim() === templateItem.trim()
);

console.log("FILTERED VARIANTS:", variants);

let existingVariant = null;

for (const variant of variants) {
    console.log("VARIANT ITEM:", variant);
console.log("VARIANT ITEM CODE:", variant.item_code);

  const variantDocRes = await axios.get(
  `${API}/api/resource/Item/${encodeURIComponent(variant.name)}`,
    authHeaders
  );

  const variantDoc = variantDocRes.data.data;

  console.log("FULL VARIANT DOC:", variantDoc);

  const matched = isMatchingVariant(
    variantDoc.attributes || [],
    quantity,
    grain,
    gpvRatio
  );

  if (matched) {
    existingVariant = variantDoc;
    break;
  }
}
    /*
    ====================================================
    STEP 4 → RETURN EXISTING VARIANT
    ====================================================
    */

    if (existingVariant) {
      console.log(
        "EXISTING VARIANT FOUND:",
        existingVariant.item_code
      );

      return {
        item_code: existingVariant.item_code,
        existing: true,
      };
    }

    /*
    ====================================================
    STEP 5 → CREATE NEW VARIANT
    ====================================================
    */

    const variantPayload = {
    item_code: `${templateItem}-${Date.now()}`,

      item_name: `${templateItem} Variant ${Date.now()}`,

      variant_of: templateItem,

      item_group: "Pet Meals",

      stock_uom: "Gram",

      attributes: [
        {
          attribute: "Quantity",
          attribute_value: quantity,
        },

        {
          attribute: "Grain",
          attribute_value: grain,
        },

        {
          attribute: "G P V Ratio",
          attribute_value: gpvRatio,
        },
      ],
    };

    console.log("CREATING VARIANT:", variantPayload);

    const createRes = await axios.post(
      `${API}/api/resource/Item`,
      variantPayload,
      authHeaders
    );

    console.log(
      "NEW VARIANT CREATED:",
      createRes.data.data.item_code
    );

    /*
    ====================================================
    STEP 6 → RETURN NEW VARIANT
    ====================================================
    */

    return {
      item_code: createRes.data.data.item_code,
      existing: false,
    };
  } catch (err) {
    console.error("VARIANT ERROR:", err);

    throw err;
  }
};