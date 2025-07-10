import { categories } from "@/mock";

function CategorySection() {

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          Browse by Category
        </h2>
        <div className="flex items-center justify-center gap-8">
          {categories.map((category, index) => (
            <a key={index} href={`/tasks?category=${category.value}`}>
              <div className="flex cursor-pointer flex-col items-center">
                <div className={`${category.color} mb-4 rounded-full p-4`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
