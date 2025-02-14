'use client';

import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/containers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          subtitle: subtitle || undefined,
          type: 'Post' as const,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const data = await response.json();
      window.location.href = `/posts/${data.shortname}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans p-6">
      <h1 className="text-4xl font-bold mb-4">Create New Post</h1>
      <h2 className="text-xl font-semibold mb-2">
        <CreateIcon className="mr-2" />
        Post Details
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <table className="table-auto border-collapse w-full">
          <colgroup>
            <col className="w-[20%]" />
            <col />
          </colgroup>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                <label htmlFor="title">Title</label>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border rounded bg-white"
                />
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                <label htmlFor="subtitle">Subtitle</label>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                />
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !title}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
