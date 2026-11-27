import sys
head=open(__import__('os').environ.get('EP_HEAD','ep1_dem_tao.html'),encoding='utf-8').read().split('<script>')[0]
body=open(sys.argv[1],encoding='utf-8').read()
open(sys.argv[2],'w',encoding='utf-8').write(head+'<script>\n'+body+'\n</script>\n<script src="engine.js"></script></body></html>')
