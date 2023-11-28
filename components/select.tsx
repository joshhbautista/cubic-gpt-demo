'use client';

import React, { useTransition } from 'react';
import { Select, SelectItem } from '@tremor/react';
import { usePathname, useRouter } from 'next/navigation';
import { ASSISTANTS } from '../lib/config';

interface AssistantSelectProps {
  activeAssistantId: string;
}

export function AssistantSelect({ activeAssistantId }: AssistantSelectProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [_isPending, startTransition] = useTransition();

  function handleSelect(assistantId: string) {
    const params = new URLSearchParams(window.location.search);

    params.set('assistantId', assistantId);

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div style={{ height: '53.090px' }} className="max-w-sm mx-auto space-y-6">
      <Select value={activeAssistantId} onValueChange={handleSelect}>
        {ASSISTANTS.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
