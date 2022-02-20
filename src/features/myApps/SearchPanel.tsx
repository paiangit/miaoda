import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import useDebounce from '~hooks/useDebounce';
import './SearchPanel.less';

interface SearchPanelProps {
  keyword: string;
  setParams: ({ keyword: unknown }) => void
}

export default function SearchPanel({ keyword, setParams }: SearchPanelProps) {
  const [title, setTitle] = useState(keyword);

  const handleSearch = (value: string) => {
    setTitle(value);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  const debounceValue = useDebounce(title, 300);

  useEffect(() => {
    setParams({
      keyword: debounceValue
    });
  }, [debounceValue]); // 注意这里不能把 setParams 加进来，否则会造成循环渲染

  return (
    <Form className="my-apps-search-panel">
      <Input.Search
        className="search-input"
        placeholder="请输入应用名称"
        allowClear
        size="middle"
        onSearch={handleSearch}
        onChange={handleChange}
      />
    </Form>
  );
}
