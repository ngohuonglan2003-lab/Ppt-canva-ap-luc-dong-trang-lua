"""Sinh lời thoại gộp (1 đoạn, tiếng Anh) + spec cho auto_cuts từ nhiều meta.
python3 voice_script.py out_prefix ep22_meta.json ep23_meta.json ...  → out_prefix_voice.md, out_prefix_spec.json"""
import sys,json
out=sys.argv[1]; metas=[json.load(open(f)) for f in sys.argv[2:]]
para=' '.join(f'[{tag}] {text}' for m in metas for tag,text in m['voice'])
spec={'episodes':[{'name':m['file'].split('_')[0],'dur':m['dur'],'targets':m['targets'],'words':m['words']} for m in metas]}
json.dump(spec,open(out+'_spec.json','w'))
md=['# Voice script (English, one paragraph)','','Paste into ElevenLabs v3 as one generation (Stability: Creative/Natural, bright cheerful young female voice).','','```',para,'```','']
friends=[(m['name'],t) for m in metas for (s,c) in zip(m['spk'],m['caps']) if s!='chick' for t in [f"{s}: \"{c[2]}\""]]
if friends: md+=['Lines spoken by friends (optional: a second, higher voice):']+[f'- {n}: {t}' for n,t in friends]
open(out+'_voice.md','w').write('\n'.join(md)); print(len(para),'ký tự →',out+'_voice.md')
