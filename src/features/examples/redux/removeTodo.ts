import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { TODOS_REMOVE_TODO } from './constants';

interface TodosState {
  todoList: string[];
}

// 单个action
export function removeTodo(index) {
  return {
    type: TODOS_REMOVE_TODO,
    payload: index,
  };
}

// 单个reducer
export function reducer(state: TodosState, action) {
  switch (action.type) {
    case TODOS_REMOVE_TODO:
      // 下面这样写会导致页面不更新
      // const newState = {...state};
      // newState.todoList.splice(action.payload, 1);
      // return newState;
      // 不更新的原因是，
      // 这里todoList在是通过useSelector获取的，而在react-redux内部，
      // useSelector.js中，有一个checkForUpdates方法，其中关于是否forceupdate，有两个判断条件：
      // 1）先判断新旧state是否相等
      // 2）然后再判断新旧state的selectedState(也就是useSelector所选择的那部分state是否相等，这里就是.todoList是否相等)
      // 如果相等，则直接return掉，否则在函数的末尾就会执行forceRender()函数进行重新渲染
      // 这里因为我们对newState所做的是浅拷贝，所以对todoList修改的时候，原state中的todoList也被改掉了，因此，虽然在第一个条件判断的时候是不相等，
      // 但在第二个条件判断的时候是相等的，因此就不会重新渲染。
      // 上面提到判断是否相等，那么判断是否相等的函数是什么呢？默认采用的：
      // var refEquality = function refEquality(a, b) {
      //   return a === b;
      // };
      // 但如果你在应用中使用useSelector()的时候传入了第二个参数，那么它将用你传入的这第二个参数作为比较函数。
      // 所以，我们要想让我们这个代码能够渲染，也就有两个办法，一个是给useSelector传入第二个参数() => false，这样不管state.todoList有没有更新，都会重新渲染，这个动作性能是非常差的，所以肯定不能这么做，但你可以试着改成这样来对上面所分析的内容有更直观的掌握，
      // 第二种办法就是，避免修改到原来的state.todoList，办法就是先把todoList拷贝到一个新的数组中，在新数组上进行splice相关操作，最后再把新数组挂到newState上进行返回，就像下面这样：
      // const newState = {...state};
      // const todoList = [...newState.todoList];
      // todoList.splice(action.payload, 1);
      // newState.todoList = todoList;
      // return newState;
      // 但是，显然，这不是一个好的实践。好的实践是采用immer，或者采用内置了immer的Redux Toolkit。永远地杜绝这类问题发生。
      // 如果你想知道手工操作react-redux的状态有多危险，看看这个感受下就知道：https://blog.csdn.net/qq_40259641/article/details/105275819
      return {
        ...state,
        todoList: state.todoList.filter((item, index) => index !== action.payload),
      };

    default:
      return state;
  }
}

// 单个hook
export default function useRemoveTodo() {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const boundAction = useCallback(
    (index) => dispatch(removeTodo(index)),
    [dispatch]
  );

  return {
    todoList,
    removeTodo: boundAction,
  };
}
