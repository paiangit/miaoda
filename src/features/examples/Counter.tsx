import { useCounterPlusOne, useCounterMinusOne } from './redux/hooks.ts';
import './Counter.less';

export default function Counter() {
  const { count, counterPlusOne } = useCounterPlusOne();
  const { counterMinusOne } = useCounterMinusOne();

  return (
    <div className='examples-counter'>
      <div className='count'>计数：{count}</div>
      <button className='minus-one' onClick={counterMinusOne}>-</button>
      <button className='plus-one' onClick={counterPlusOne}>+</button>
    </div>
  );
}
