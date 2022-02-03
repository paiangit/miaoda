import { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { useDebounce } from '../common/hooks/index.ts';
import './SearchPanel.less';

interface SearchPanelProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export default function SearchPanel(props: SearchPanelProps) {
  const { Search } = Input;
  const { keyword, setKeyword } = props;
  const [title, setTitle] = useState(keyword);

  const handleSearch = (value) => {
    setTitle(value);
  };
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const debounceValue = useDebounce(title, 300);

  useEffect(() => {
    console.log(debounceValue);
    setKeyword(debounceValue);
  }, [debounceValue]);

  return (
    <Form className="my-apps-search-panel">
      <Search
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
