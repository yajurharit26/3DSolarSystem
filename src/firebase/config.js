import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug Firebase configuration
console.log("Firebase Config (Project ID):", firebaseConfig.projectId);
console.log("Environment Variables Loaded:", {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  hasAuthDomain: !!firebaseConfig.authDomain,
});

let db;
try {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase App initialized successfully");
  db = getFirestore(app);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export { db };

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log("Starting Firebase connection test...");

    // Verify database instance
    if (!db) {
      throw new Error("Firestore instance not initialized");
    }

    // Try to add a test document
    const testDoc = await addDoc(collection(db, "test_connection"), {
      timestamp: new Date(),
      test: "Firebase connection test",
    });
    console.log(
      "Firebase connection successful! Test document written with ID: ",
      testDoc.id
    );

    // Read the test collection
    const querySnapshot = await getDocs(collection(db, "test_connection"));
    console.log(
      "Successfully read from Firestore. Number of documents: ",
      querySnapshot.size
    );

    return true;
  } catch (error) {
    console.error("Firebase connection test failed with error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return false;
  }
};
