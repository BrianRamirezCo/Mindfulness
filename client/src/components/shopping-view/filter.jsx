import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const filterLabels = {
  category: "Categoría",
  brand: "Formato",
};

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-card rounded-xl border border-border/50 sticky top-20 h-fit">
      <div className="p-4 border-b border-border/40">
        <h2 className="font-serif text-lg text-foreground tracking-wide">
          Filtros
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-xs font-sans uppercase tracking-widest text-foreground/50 mb-3">
                {filterLabels[keyItem] || keyItem}
              </h3>
              <div className="grid gap-2.5">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm font-sans text-foreground/70 group-hover:text-foreground transition-colors">
                      {option.label}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-border/30" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
