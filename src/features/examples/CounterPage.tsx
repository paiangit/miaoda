import Counter from './Counter';
import { useDocumentTitle } from '../common/hooks/useDocumentTitle';
import './CounterPage.less';

export default function CounterPage() {
  useDocumentTitle('计数器例子');

  return (
    <div className="examples-counter-page">
      <Counter />
    </div>
  );
}
