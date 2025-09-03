const {
  getCategoriesFromTextRazor,
  getCategoriesFromInterfaceAPI,
  getCategoriesFromClassifierAPI,
} = require("./apiServices");

class CategoryFilterService {
  async getCategories(content, timeout) {
    throw new Error("Not implemented");
  }
}

class TextRazorService extends CategoryFilterService {
  async getCategories(content, timeout) {
    return await getCategoriesFromTextRazor(content, timeout);
  }
}

class InterfaceAPIService extends CategoryFilterService {
  async getCategories(content, timeout) {
    return await getCategoriesFromInterfaceAPI(content, timeout);
  }
}

class ClassifierAPIService extends CategoryFilterService {
  async getCategories(content, timeout) {
    return await getCategoriesFromClassifierAPI(content, timeout);
  }
}

function createCategoryFilterService(servicePreference) {
  switch (servicePreference) {
    case "TextRazor":
      return new TextRazorService();
    case "InterfaceAPI":
      return new InterfaceAPIService();
    case "ClassifierAPI":
      return new ClassifierAPIService();
    case "disabled":
    case null:
    case undefined:
    case "":
      // Return a dummy service that doesn't do any filtering
      return {
        getCategories: async () => ({})
      };
    default:
      console.warn(`Unknown service preference: ${servicePreference}, using disabled mode`);
      // Return a dummy service instead of throwing an error
      return {
        getCategories: async () => ({})
      };
  }
}

module.exports = createCategoryFilterService;
