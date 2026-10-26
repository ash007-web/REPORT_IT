import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/items";

export function useItems(customFilter = null, userIdFilter = null) {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  
  // Standard UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine effective filter (customFilter prop takes precedence if passed)
  const activeTypeFilter = customFilter !== null ? customFilter : filter;

  // Fetch Items from Backend
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeTypeFilter && activeTypeFilter !== "all") {
        params.append("type", activeTypeFilter);
      }
      if (userIdFilter) {
        params.append("userId", userIdFilter);
      }
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${API_URL}${queryString}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch items from the server");
      }
      
      const rawData = await response.json();
      
      // Normalize item properties: backend DB provides user_id and item_date
      const normalizedData = rawData.map((item) => {
        let formattedDate = item.item_date;
        if (formattedDate) {
          formattedDate = String(formattedDate).split("T")[0];
        } else if (item.date) {
          formattedDate = String(item.date).split("T")[0];
        } else if (item.created_at) {
          formattedDate = String(item.created_at).split("T")[0];
        }

        return {
          ...item,
          userId: item.user_id !== undefined ? item.user_id : item.userId,
          date: formattedDate || "Recent",
        };
      });

      setItems(normalizedData);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeTypeFilter, userIdFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(
    async (formData) => {
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const payload = {
          userId: currentUser.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: formData.date || new Date().toISOString().split("T")[0],
          type: formData.type,
        };

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create item");
        }

        const newItem = await response.json();
        
        const formattedDate = (newItem.item_date || newItem.date || newItem.created_at || "").split("T")[0];
        const normalizedNewItem = {
          ...newItem,
          userId: newItem.user_id !== undefined ? newItem.user_id : newItem.userId,
          date: formattedDate || new Date().toISOString().split("T")[0],
        };

        // Prepend optimistic item
        setItems((current) => [normalizedNewItem, ...current]);
        return normalizedNewItem;
      } catch (err) {
        console.error("API Add Error:", err);
        setError(err.message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentUser]
  );

  const resolveItem = useCallback(
    async (itemId) => {
      const previousItems = items;
      
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, status: "resolved" } : item
        )
      );

      try {
        const response = await fetch(`${API_URL}/${itemId}/resolve`, {
          method: "PATCH",
        });

        if (!response.ok) {
          throw new Error("Failed to resolve item on server");
        }
      } catch (err) {
        console.error("API Resolve Error:", err);
        setError(err.message);
        setItems(previousItems);
        throw err;
      }
    },
    [items]
  );

  const deleteItem = useCallback(
    async (itemId) => {
      const previousItems = items;
      
      setItems((current) => current.filter((item) => item.id !== itemId));

      try {
        const response = await fetch(`${API_URL}/${itemId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete item on server");
        }
      } catch (err) {
        console.error("API Delete Error:", err);
        setError(err.message);
        setItems(previousItems);
        throw err;
      }
    },
    [items]
  );

  // Statistics
  const activeCount = useMemo(
    () => items.filter((item) => item.status === "active").length,
    [items]
  );

  const lostCount = useMemo(
    () =>
      items.filter((item) => item.type === "lost" && item.status === "active")
        .length,
    [items]
  );

  const foundCount = useMemo(
    () =>
      items.filter((item) => item.type === "found" && item.status === "active")
        .length,
    [items]
  );

  return {
    items,
    filter,
    setFilter,
    
    addItem,
    resolveItem,
    deleteItem,
    refetch: fetchItems,
    
    isSubmitting,
    isLoading,
    error,
    
    activeCount,
    lostCount,
    foundCount,
  };
}
