'use client';

import React, { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Status } from '@/lib/types';
import { classNames } from '@/lib/utils';

interface TabsProps {
  tabs: Status[];
  activeTabId: string;
}

const Tabs = ({ tabs, activeTabId }: TabsProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [_isPending, startTransition] = useTransition();

  function handleClick(statusId: string) {
    const params = new URLSearchParams(window.location.search);

    params.set('statusId', statusId);

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-300">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map(({ status_id, label }) => (
          <li key={status_id} className="me-2">
            <a
              href="#"
              onClick={() => handleClick(status_id.toString())}
              className={classNames(
                activeTabId === status_id.toString()
                  ? 'active dark:text-blue-500 dark:border-blue-500'
                  : '',
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
