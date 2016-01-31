# 轮播图
﻿*发现一个致命的问题：
﻿*在css中申明﻿ element.style.left = 0，按钮被click，改变element.style.left的值后。
﻿*再次解析 'left' 的值时会出错。 声明会被丢弃. 变为NaN;
*﻿解决办法 必须在html文档中申明该element 的style="left:0;
﻿*具体怎么造成的还不清楚

