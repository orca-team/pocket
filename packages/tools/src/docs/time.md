---
title: time 日期相关
nav:
  title: Tools
  path: /tools
group:
  title: 基础工具
  path: /base
---

# time 时间相关工具集

## smartDateFromNow

```tsx
import React from 'react';
import moment from 'moment';
import { smartDateFromNow } from '@orca-fe/tools';

export default () => (
  <div>
    <ol>
      {[
        moment().add(-10, 'second').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-2, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-50, 'day').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-200, 'day').format('YYYY-MM-DD HH:mm:ss'),
        '2020-01-20',
        '2005-12-30',
        '1992-02-14',
      ].map((text) => (
        <li>
          {text}({smartDateFromNow(text)})
        </li>
      ))}
    </ol>
  </div>
);
```
