import { useEffect, useState } from "react";
import {
  Query,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

export function useFirestoreCollection(query: Query | null) {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!query) return;

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading };
}
