import React, { MouseEvent, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { useDebounce } from '../common/hooks/index';
import './SearchPanel.less';

interface SearchPanelProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export default function SearchPanel({ keyword, setKeyword }: SearchPanelProps) {
  const [title, setTitle] = useState(keyword);

  const handleSearch = (value: string) => {
    setTitle(value);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  const debounceValue = useDebounce(title, 300);

  useEffect(() => {
    console.log(debounceValue);
    setKeyword(debounceValue);
  }, [debounceValue]);

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
