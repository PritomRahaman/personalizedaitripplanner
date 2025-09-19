// src/entities/tripPlan.js
import { db, ref, push, set, get, child, update } from "../../firebase";

export const TripPlan = {
  async create(data) {
    const newRef = push(ref(db, "tripPlans"));
    const id = newRef.key;
    console.log(id)
    const tripWithId = { id, ...data };
    await set(newRef, tripWithId);
    console.log(tripWithId)

    return tripWithId;
  },


  async getById(id) {
    const snapshot = await get(child(ref(db), `tripPlans/${id}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  },
  async list() {
    const snapshot = await get(child(ref(db), "tripPlans"));
    if (snapshot.exists()) {
      const tripsObj = snapshot.val();
      return Object.keys(tripsObj).map(key => ({
        id: key,
        ...tripsObj[key],
      }));
    }
    return [];
  },

  async filter({ id }) {
    if (!id) return [];
    const item = await this.getById(id);
    return item ? [item] : [];
  },

  async update(id, updatedData) {
    await update(ref(db, `tripPlans/${id}`), updatedData);
    return true;
  }
};


