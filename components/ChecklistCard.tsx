'use client';

import { Card } from './Card';

export interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  completed: boolean;
}

export interface ChecklistCardProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  compact?: boolean;
}

export function ChecklistCard({ items, onToggle, compact = false }: ChecklistCardProps) {
  const categories = Array.from(new Set(items.map(item => item.category)));
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  if (compact) {
    return (
      <Card title="Preparedness Checklist" subtitle={`${completedItems} of ${totalItems} items`}>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{Math.round(progressPercent)}% complete</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Preparedness Checklist" subtitle={`${completedItems} of ${totalItems} items complete`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-teal-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{Math.round(progressPercent)}% complete</p>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          const categoryCompleted = categoryItems.filter(item => item.completed).length;

          return (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>{category}</span>
                <span className="text-sm text-gray-600">
                  ({categoryCompleted}/{categoryItems.length})
                </span>
              </h4>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => onToggle(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 cursor-pointer"
                    />
                    <span
                      className={`ml-3 text-sm ${
                        item.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-700'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
