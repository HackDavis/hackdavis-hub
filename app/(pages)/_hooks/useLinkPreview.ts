'use client';

import { useState, useEffect } from 'react';
import { fetchLinkPreview } from '@actions/starter_kit/getLinkPreview';

interface LinkPreview {
  title: string;
  description: string;
  images: string[];
}

export function useLinkPreview(url: string, fallbackTitle: string) {
  const [preview, setPreview] = useState<LinkPreview>({
    title: fallbackTitle,
    description: '',
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getPreview = async () => {
      try {
        setLoading(true);
        setError(false);

        const result = await fetchLinkPreview(url);

        if (result.ok && result.data) {
          const data = result.data;
          setPreview({
            title: data.title || fallbackTitle,
            description: data.description || '',
            images:
              Array.isArray(data.images) && data.images.length
                ? data.images.filter((img) => typeof img === 'string')
                : [],
          });
        } else {
          throw new Error(result.error || 'Failed to fetch preview');
        }
      } catch (error) {
        console.error('Failed to fetch preview:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getPreview();
  }, [url, fallbackTitle]);

  return { preview, loading, error };
}
