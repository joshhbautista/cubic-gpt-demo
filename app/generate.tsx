'use client';

import { useState } from 'react';
import { Button, Flex, NumberInput } from '@tremor/react';

export default function Generate() {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(1);

  const handleClick = () => {
    setIsLoading(true);
    fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ num: value })
    })
      .then((res) => {
        console.log(res);
        // window.location.reload()
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Flex className="w-full justify-end gap-3">
      <NumberInput
        className="w-1/4"
        min={1}
        max={100}
        value={value}
        onValueChange={setValue}
        placeholder="Generate"
      />
      <Button
        loading={isLoading}
        loadingText="Generating..."
        onClick={handleClick}
      >
        Generate
      </Button>
    </Flex>
  );
}
