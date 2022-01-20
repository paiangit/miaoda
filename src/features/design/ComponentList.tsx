import { useState } from 'react';

export default function ComponentList() {
  const [loading, setLoading] = useState(false);

  const data = [
    {
      title: '布局容器',
      componentName: 'ColumnsLayout',
      packageName: '@paian/lc-components',
      id: 'ColumnsLayout_0',
      category: '布局',
      snippets: [
        {
          id: 'snippet_0',
          thumbnail: {
            image: 'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
            svg: {
              className: 'icon',
              width: '200px',
              height: '200px',
              viewBox: '0 0 1024 1024',
              version: '1.1',
              xmlns: 'http://www.w3.org/2000/svg'
            },
          },
          description: '1 + 2',
          schema: {
            componentName: 'ColumnsLayout',
            props: {
              layout: '12:9:3',
              columnGap: '16px',
              rowGap: '16px'
            },
            children: [
              {
                componentName: 'Column',
                props: {},
                children: []
              },
              {
                componentName: 'Column',
                props: {},
                children: []
              },
              {
                componentName: 'Column',
                props: {},
                children: []
              },
            ]
          }
        },
        {
          id: 'snippet_1',
          thumbnail: 'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
          description: '单栏',
          schema: {
            componentName: 'ColumnsLayout',
            props: {
              layout: '12',
              columnGap: '16px',
              rowGap: '16px'
            },
            children: [
              {
                componentName: 'Column',
                props: {},
                children: []
              }
            ]
          }
        },
        {
          id: 'snippet_2',
          thumbnail: 'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
          description: '混合',
          schema: {
            componentName: 'ColumnsLayout',
            props: {
              layout: '8:4:4:4',
              columnGap: '16px',
              rowGap: '16px'
            },
            children: [
              {
                componentName: 'Column',
                props: {},
                children: []
              },
              {
                componentName: 'Column',
                props: {},
                children: []
              },
              {
                componentName: 'Column',
                props: {},
                children: []
              },
              {
                componentName: 'Column',
                props: {},
                children: []
              },
            ]
          }
        },
      ],
    },
    {
      title: '容器',
      componentName: 'Div',
      packageName: '@paian/lc-components',
      id: 'Div_1',
      category: '布局',
      snippets: [
        {
          id: 'snippet_1',
          thumbnail: {
            key: null,
            ref: null,
            props: {
              width: '200px',
              height: '200px',
              viewBox: '0 0 1024 1024'
            },
            _owner: null
          },
          description: '容器',
          schema: {
            componentName: 'Div'
          }
        }
      ],
    },
    {
      category: '布局',
      componentName: 'TabsLayout',
      title: '选项卡',
      packageName: '@paian/lc-components',
      snippets: [
        {
          id: 'snippet_1',
          thumbnail: 'https://img.alicdn.com/tfs/TB1D0p2u.z1gK0jSZLeXXb9kVXa-112-64.png',
          description: '普通型',
          schema: {
            componentName: 'TabsLayout',
            props: {},
            children: [{
              componentName: 'Tab',
              props: {
                primaryKey: 'tab_kxo4dcnv'
              }
            }, {
              componentName: 'Tab',
              props: {
                primaryKey: 'tab_kxo4dcnw'
              }
            }]
          }
        }
      ],
    }
  ];
  return (
    <div className="editor-component-list" >
      {loading && (<div>组件正在加载中...</div>)}
    </div >
  );
}