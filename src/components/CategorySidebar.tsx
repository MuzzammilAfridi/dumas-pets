import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CategoryNode = {
  name: string;
  children?: CategoryNode[];
  templates?: any[];
};

type Props = {
  categoryTree: CategoryNode[];
  openCategory: string | null;
  setOpenCategory: (val: string | null) => void;
  activeCategory: string | undefined;
  activeTemplate?: string;
  selectedSubCategory?: string;
  setSelectedSubCategory?: (val: string) => void;
};

const CategorySidebar = ({
  categoryTree,
  openCategory,
  setOpenCategory,
  activeCategory,
  activeTemplate,
  selectedSubCategory,
  setSelectedSubCategory,
}: Props) => {
  const navigate = useNavigate();

  const getSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-6">
      {/* Title */}
      <div>
        <h3 className="font-bold text-lg mb-4">Categories</h3>

        <nav className="space-y-2">
          {categoryTree.map((cat) => {
            const slug = getSlug(cat.name);
            const isOpen = openCategory === slug;

            return (
              <div key={cat.name}>
                {/* 🔥 Parent Category */}
                <div
                  onClick={() => {
                    navigate(`/category/${slug}/all`); // ✅ navigate
                    setOpenCategory(slug); // ✅ expand
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                    slug === activeCategory
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{cat.name}</span>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {/* 🔥 Child Categories */}
                {isOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {/* 🔹 Child Categories */}
                  {cat.children?.map((child) => {
  const childSlug = getSlug(child.name);

  return (
    <div
      key={child.name}
      onClick={() => {
        setSelectedSubCategory?.(child.name);
      }}
      className={`p-2 rounded-md cursor-pointer text-sm transition ${
        selectedSubCategory === child.name
          ? "bg-primary text-white"
          : "hover:bg-muted"
      }`}
    >
      {child.name}
    </div>
  );
})}

                    {/* 🔥 Templates (YOUR FIX) */}
                    {cat.templates?.map((template) => {
                      const isActive = template.item_code === activeTemplate;

                      return (
                        <div
                          key={template.item_code}
                          onClick={() =>
                            navigate(`/template/${template.item_code}`)
                          }
                          className={`p-2 ml-2 rounded-md cursor-pointer text-sm transition ${
                            isActive
                              ? "bg-[#FEB932] text-white font-medium"
                              : "bg-muted text-muted-foreground hover:text-primary hover:bg-muted"
                          }`}
                        >
                          {template.item_name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CategorySidebar;
