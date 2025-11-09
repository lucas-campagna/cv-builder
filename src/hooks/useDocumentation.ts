import { useState, useEffect } from 'react';

export const useDocumentation = (docPath: string) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoc = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/cv-builder/docs/${docPath}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${docPath}`);
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, [docPath]);

  return { content, loading, error };
};