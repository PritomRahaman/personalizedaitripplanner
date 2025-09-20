// Fake User entity
export const User = {
    me: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          id: 1,
          full_name: "John Doe",
          email: "john.doe@example.com",
          role: "traveler"
        }), 300);
      });
    }
  };
  
  // Fake UserPreferences entity
  let preferencesDB = []; // in-memory DB
  
  export const UserPreferences = {
    filter: async ({ created_by }) => {
      return preferencesDB.filter(p => p.created_by === created_by);
    },
    create: async (data) => {
      const newPref = { ...data, id: Date.now(), created_by: "john.doe@example.com" };
      preferencesDB.push(newPref);
      return newPref;
    },
    update: async (id, data) => {
      const index = preferencesDB.findIndex(p => p.id === id);
      if (index !== -1) {
        preferencesDB[index] = { ...preferencesDB[index], ...data };
        return preferencesDB[index];
      }
      throw new Error("Preferences not found");
    }
  };
  