define(['jquery', '../util/funcTpl', 'juicer'], function($, funcTpl) {

	var app = {
		init:function () {

				var data = {
				    list: [
				        {name:' guokai', show: true},
				        {name:' benben', show: false},
				        {name:' dierbaby', show: true}
				    ],
				    blah: [
				        {num: 1},
				        {num: 2},
				        {num: 3, inner:[
				            {'time': '15:00'},
				            {'time': '16:00'},
				            {'time': '17:00'},
				            {'time': '18:00'}
				        ]},
				        {num: 4}
				    ]
				};
				
				console.log(app.moduleTpl);
				console.log(funcTpl);
				var html = juicer(funcTpl(app.moduleTpl), data);
				$('#content').html(html);
			
		},
		moduleTpl: function () {
			/* <ul>
			       {@each list as it,index}
			           <li>${it.name} (index: ${index})</li>
			       {@/each}
			       {@each blah as it}
			           <li>
			               num: ${it.num} <br />
			               {@if it.num==3}
			                   {@each it.inner as it2}
			                       ${it2.time} <br />
			                   {@/each}
			               {@/if}
			           </li>
			       {@/each}
			   </ul>
			*/
		}
	};
	return app.init();
});