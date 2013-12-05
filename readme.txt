html5微周刊
《html5微周刊》html5版实现原理：
1、根据不同屏幕尺寸加载不同css文件
2、使用ajax获取杂志总体信息：共多少期；每期多少页
2、使用ajax加载杂志页面
3、杂志页面说明：
a.第一页为1.html 以此类推
b.编码说明：
<article>
	<div class="page">
		<h1>HTML5年会——最新情报汇报</h1>
		<div class="content">
			<p>收到谷歌赞助本次活动的礼品：精美水瓶、机器毛绒娃娃、鼠标垫、笔记本内胆包。感谢谷歌，还有坤哥和@HanruiGao 长期对小组的关注与支持。</p>
			<img src="../weizhoukan/26/images/2_1.jpg" style="height:140px"/>
			<img src="../weizhoukan/26/images/2_2.jpg" style="height:140px"/>
			<img src="../weizhoukan/26/images/2_3.jpg" style="height:140px"/>
			<p>收到来自@UC浏览器 赞助本次活动的各种礼品：松鼠公仔、百变UU、闹钟。非常感谢UC及众多企业对本次活动的大力支持。只要大家积极参与互动活动，除了能结交N多朋友外，还能带走多多的礼品。</p>
			<img src="../weizhoukan/26/images/uc.jpg" style="height:240px"/>
			<p>@图灵教育 为本次活动提供了50张100元购书券（可持券去图灵展台任挑），我们将互动给嘉宾及与会的大家。PS：图灵线上活动正在进行中，参与便有机会于活动当天现场领取礼品1份。</p>
			<p>首届HTML5原创游戏大赛已确认出席29号现场点评互动评委有@蔡学镛 @继佳 @HanruiGao@斩梦人天天 @大城小胖 @秀野堂主 @热酷刘勇 @zibin @钱赓 @CQ_陈琦265G郭丽娜 完美时空许怡然 感动+感谢！欢迎大家现场多积极参与交流、互动。</p>
			<img src="../weizhoukan/26/images/2_c.jpg" style="height:460px"/>
		</div>
	</div>
</article>
class="page" 获取当前页
class="content" 对内容分栏
图片必须指定高度

操作说明：
1、左侧为导航栏
2、左右滑动翻页