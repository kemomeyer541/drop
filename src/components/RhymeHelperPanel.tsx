import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, Plus, BookOpen, Target } from 'lucide-react';
import { tokenize, rhymeKey } from '../utils/rhyme';

// Sample rhyme database for reliable testing
const SAMPLE_RHYMES = {
  love: ['above','dove','shove','glove','thereof','enough','tough','rough'],
heart: ['apart','start','chart','dart','smart','art','impart','restart'],
time: ['rhyme','climb','prime','sublime','mime','chime','slime','crime'],
dream: ['beam','cream','stream','scheme','extreme','esteem','team','supreme'],
light: ['night','bright','flight','sight','tight','height','might','delight'],
fire: ['desire','inspire','entire','require','acquire','admire','wire','higher'],
day: ['play','stay','way','say','delay','array','display','away'],
life: ['strife','knife','wife','rife','midlife','afterlife','wildlife','fife'],
pain: ['rain','chain','main','strain','again','domain','sustain','remain'],
song: ['long','strong','belong','along','wrong','throng','prolong','gong'],
flow: ['go','show','blow','know','throw','slow','bestow','below'],
beat: ['street','seat','meet','heat','tweet','repeat','defeat','retreat'],
high: ['fly','sky','sigh','try','dry','apply','rely','goodbye'],
low: ['show','glow','go','know','throw','flow','below','bestow'],
night: ['light','bright','flight','sight','tight','height','might','delight'],
dark: ['spark','mark','stark','park','shark','remark','embark','lark'],
star: ['far','car','bar','guitar','avatar','radar','seminar','bizarre'],
moon: ['soon','tune','noon','balloon','cartoon','monsoon','maroon','spoon'],
sky: ['high','fly','sigh','try','dry','apply','rely','goodbye'],
rise: ['eyes','size','wise','surprise','prize','guise','despise','supplies'],
fall: ['all','call','small','tall','stall','recall','install','hall'],
sound: ['ground','around','profound','found','bound','astound','resound','surround'],
word: ['heard','absurd','preferred','blurred','conferred','inferred','stirred','occurred'],
line: ['shine','sign','divine','combine','resign','confine','align','design'],
bar: ['far','car','star','guitar','avatar','radar','seminar','bizarre'],
verse: ['worse','curse','rehearse','disperse','universe','converse','reverse','perverse'],
rap: ['cap','slap','map','trap','snap','wrap','clap','gap'],
mic: ['like','strike','bike','spike','hike','psych','pike','dislike'],
stage: ['page','age','cage','engage','rage','wage','outrage','sage'],
crowd: ['loud','proud','shroud','cloud','allowed','endowed','avowed','bowed'],
voice: ['choice','rejoice','noise','poise','boys','toys','employs','destroys'],
flowing: ['showing','knowing','glowing','throwing','growing','bestowing','overflowing','undergoing'],
moving: ['proving','soothing','grooving','improving','removing','approving','disproving','reproving'],
running: ['stunning','gunning','cunning','sunning','dunning','punning','bunning','shunning'],
living: ['giving','forgiving','reliving','misgiving','thanksgiving','driving','surviving','striving'],
loving: ['shoving','gloving','above in','coving','doving','roving','proving','moving'],
crying: ['flying','dying','buying','relying','complying','defying','implying','replying'],
dying: ['crying','flying','buying','relying','applying','complying','supplying','defying'],
trying: ['crying','flying','buying','relying','applying','complying','supplying','defying'],
flying: ['crying','dying','buying','relying','applying','complying','supplying','defying'],
going: ['showing','knowing','glowing','throwing','growing','bestowing','overflowing','undergoing'],
knowing: ['showing','going','glowing','throwing','growing','bestowing','overflowing','undergoing'],
seeing: ['being','fleeing','agreeing','freeing','treeing','kneeing','guaranteeing','foreseeing'],
being: ['seeing','fleeing','agreeing','freeing','treeing','kneeing','guaranteeing','foreseeing'],
feeling: ['dealing','healing','reeling','stealing','appealing','concealing','revealing','wheeling'],
healing: ['feeling','dealing','reeling','stealing','appealing','concealing','revealing','wheeling'],
breaking: ['taking','making','faking','shaking','quaking','mistaking','forsaking','undertaking'],
making: ['taking','breaking','faking','shaking','quaking','mistaking','forsaking','undertaking'],
taking: ['breaking','making','faking','shaking','quaking','mistaking','forsaking','undertaking'],
lost: ['cost','frost','tossed','exhaust','embossed','crossed','accost','mossed'],
found: ['ground','around','sound','bound','astound','resound','surround','profound'],
home: ['roam','foam','dome','chrome','gnome','loam','comb','tome'],
alone: ['stone','tone','phone','known','drone','shown','grown','bone'],
together: ['forever','endeavor','whenever','wherever','clever','lever','sever','however'],
forever: ['together','endeavor','whenever','wherever','clever','lever','sever','however'],
never: ['ever','clever','endeavor','whenever','wherever','sever','however','whoever'],
always: ['days','ways','praise','raise','phase','maze','blaze','gaze'],
sometimes: ['rhymes','climbs','times','mimes','dimes','crimes','sublimes','grimes'],
  sus: ['bus','plus','fuss','cuss','thus','discuss','trust','adjust'],
drip: ['slip','trip','flip','equip','grip','zip','whip','ship'],
cap: ['slap','trap','snap','map','app','gap','wrap','recap'],
'no cap': ['recap','strap','snap','map','flap','trap','handclap','overlap'],
vibe: ['tribe','scribe','imbibe','subscribe','describe','diatribe','bribe','ascribe'],
meme: ['dream','beam','scheme','supreme','extreme','esteem','team','stream'],
simp: ['limp','pimp','shrimp','chimp','skimp','gimp','wimp','crimp'],
stan: ['plan','man','scan','fan','ran','clan','span','ban'],
based: ['faced','placed','traced','aced','embraced','replaced','chased','wasted'],
cringe: ['hinge','syringe','binge','tinge','fringe','infringe','whinge','plunge'],
ratio: ['patio','cameo','studio','portfolio','audio','video','scenario','oreo'],
cope: ['hope','rope','slope','mope','elope','antelope','telescope','soap'],
seethe: ['breathe','wreathe','teethe','beneath','bequeath','heath','sheath','grieve'],
bussin: ['buzzin','cousin','dozen','fussin','discussin','crushin','rushin','hushin'],
yeet: ['meet','seat','tweet','heat','street','repeat','defeat','retreat'],
sheesh: ['leash','peach','speech','beach','screech','beseech','breach','reach'],
bruh: ['duh','huh','uh','shuh','nuh','yuh','wha','gah'],
suspect: ['inspect','respect','detect','collect','connect','protect','neglect','perfect'],
clout: ['shout','spout','drought','about','sprout','knockout','burnout','blackout'],
grind: ['mind','find','kind','behind','signed','aligned','designed','refined'],
grindset: ['mindset','upset','offset','reset','asset','cassette','sunset','onset'],
dub: ['club','sub','scrub','hub','grub','tub','rub','stub'],
'L': ['sell','tell','dwell','shell','spell','smell','excel','farewell'],
'W': ['double you','trouble you','bubble crew','stubble too','shuffle through','couple new','subtle blue','snuggle crew'],
'glow up': ['show up','blow up','throw up','grow up','sew up','flow up','lineup','rollup'],
flex: ['hex','text','next','complex','vortex','apex','syntax','annex'],
ghost: ['post','toast','boast','coast','most','host','roast','almost'],
cancel: ['dismantle','scandal','panel','channel','flannel','mammal','camel','handle'],
beta: ['theta','meta','cheetah','fajita','pita','margarita','reta','eta'],
sigma: ['stigma','enigma','dogma','paradigm a','trauma','drama','carma','ligma'],
grindr: ['finder','reminder','blinder','kinder','recliner','designer','aligner','headliner'],
'ok boomer': ['consumer','rumor','humor','groomer','schooner','doomer','bloomer','roomer'],
doomer: ['rumor','tumor','humor','boomer','consumer','groomer','bloomer','loom-er'],
zoomer: ['rumor','boomer','doomer','humor','bloomer','groomer','assumer','consumer'],
glizzy: ['busy','dizzy','fizzy','lizzy','whizzy','frizzy','missy','sissy'],
thicc: ['brick','kick','lick','pick','stick','slick','tick','quick'],
drunk: ['funk','chunk','punk','skunk','bunk','hunk','sunk','shrunk'],
stoned: ['zoned','toned','owned','loaned','drone d','groaned','condoned','enthroned'],
vape: ['cape','grape','tape','escape','reshape','scrape','drape','landscape'],
blunt: ['stunt','front','hunt','grunt','punt','runt','shunt','brunt'],
joint: ['point','anoint','appoint','counterpoint','checkpoint','standpoint','disjoint','disappoint'],
hash: ['bash','crash','flash','stash','trash','splash','slash','cash'],
weed: ['need','feed','bleed','speed','greed','indeed','proceed','succeed'],
dab: ['grab','stab','slab','crab','drab','blab','cab','tab'],
molly: ['jolly','folly','holly','golly','trolley','dolly','poly','collie'],
perk: ['jerk','work','twerk','lurk','smirk','irk','shirk','quark'],
lean: ['mean','seen','green','serene','between','routine','machine','teen'],
trap: ['cap','map','slap','snap','wrap','clap','strap','entrap'],
plug: ['jug','rug','hug','mug','dug','snug','slug','thug'],
dealer: ['healer','stealer','feeler','wheeler','squealer','concealer','appealer','revealer'],
skrrt: ['hurt','flirt','shirt','dirt','alert','convert','insert','dessert'],
ops: ['cops','drops','flops','hops','mops','pops','shops','stops'],
gang: ['bang','hang','clang','fang','rang','sang','slang','yang'],
squad: ['god','odd','mod','prod','abroad','applaud','rod','plod'],
crew: ['blue','true','clue','through','pursue','askew','renew','review'],
fam: ['ham','jam','slam','cram','exam','wham','program','diagram'],
homie: ['roomie','zoomie','gloomy','doomy','boomy','broomy','chromey','tomb-y'],
bro: ['go','flow','show','snow','throw','grow','foe','below'],
sis: ['miss','kiss','bliss','dismiss','abyss','swiss','amiss','hiss'],
cousin: ['dozen','buzzin','fussin','discussin','was in','does in','wasn’t','doesn’t'],
flexin: ['textin','next in','complexin','perplexin','annexin','vexin','rexin','hexin'],
chad: ['mad','sad','glad','rad','dad','fad','ironclad','bad'],
virgin: ['surgeon','urgent','emergent','resurgent','detergent','insurgent','divergent','convergent'],
giga: ['stigma','enigma','dogma','drama','llama','magma','gamma','saga'],
brain: ['train','gain','pain','chain','strain','remain','explain','sustain'],
bag: ['lag','rag','drag','brag','flag','snag','swag','stag'],
bread: ['red','said','led','spread','thread','shed','ahead','dead'],
cash: ['bash','crash','flash','stash','trash','splash','slash','dash'],
stack: ['pack','track','back','crack','attack','snack','slack','hack'],
coin: ['join','anoint','appoint','counterpoint','checkpoint','point','groin','loin'],
crypto: ['tiptoe','zip code','hippo','dip low','clip though','grip though','script though','riptoe'],
stonks: ['honks','bonks','conks','monks','wonks','drunks','punks','skunks'],
hustle: ['muscle','tussle','rustle','bustle','jostle','castle','nestle','throttle'],
glow: ['show','flow','snow','grow','throw','bestow','foreknow','overflow'],
ping: ['ring','sing','wing','thing','fling','bring','sting','bling'],
lag: ['drag','snag','tag','flag','nag','sag','gag','rag'],
nerf: ['surf','turf','smurf','scurf','serf','swerve','curve','reserve'],
buff: ['tough','rough','scruff','stuff','bluff','huff','puff','enough'],
patch: ['match','catch','hatch','latch','snatch','dispatch','detach','rematch'],
queue: ['blue','true','clue','through','askew','pursue','renew','venue'],
meta: ['beta','theta','cheta','reta','eta','greta','vendetta','beretta'],
clique: ['unique','antique','critique','mystique','boutique','physique','oblique','technique'],
stream: ['beam','dream','scheme','esteem','extreme','supreme','team','scream'],
post: ['most','host','coast','toast','boast','ghost','almost','engrossed'],
like: ['bike','spike','hike','strike','mike','psych','pike','dislike'],
share: ['care','dare','flare','glare','rare','stare','pair','repair'],
boost: ['roost','toast','ghost','most','coast','boast','spruce','juice'],
ban: ['plan','man','scan','fan','ran','clan','span','van'],
report: ['port','fort','court','short','snort','resort','escort','support'],
queueing: ['gluing','chewing','spewing','stewing','viewing','reviewing','subduing','pursuing'],
mood: ['dude','rude','food','brood','intrude','prelude','include','conclude'],
aura: ['flora','scora','thora','quora','ignora','explora','tempora','aurora'],
vibes: ['tribes','scribes','bribes','hives','drives','arrives','survives','revives'],
ratioed: ['radioed','patio-ed','cameoed','ideoed','overflowed','bestowed','reloaded','uploaded'],
unfollow: ['hollow','swallow','follow','apollo','yolo','solo','polo','sorrow'],
};

// Helper function to calculate Hamming distance for near rhymes
function hammingDistance(a: string, b: string): number {
  if (a.length !== b.length) return Math.abs(a.length - b.length);
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) distance++;
  }
  return distance;
}

export function RhymeHelperPanel() {
  const [searchWord, setSearchWord] = useState('');
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [nearRhymes, setNearRhymes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRhymes, setSelectedRhymes] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Get popular words for suggestions
  const popularWords = Object.keys(SAMPLE_RHYMES).slice(0, 8);

  useEffect(() => {
    setSuggestions(popularWords);
  }, []);

  const findRhymes = (word: string) => {
    if (!word.trim()) {
      setRhymes([]);
      setNearRhymes([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const cleanWord = word.toLowerCase().trim();
      
      // Use shared tokenization logic
      const tokens = tokenize(cleanWord);
      if (tokens.length === 0) {
        setRhymes([]);
        setNearRhymes([]);
        setIsLoading(false);
        return;
      }

      const searchToken = tokens[0];
      const searchKey = rhymeKey(searchToken.norm);
      
      if (!searchKey) {
        setRhymes([]);
        setNearRhymes([]);
        setIsLoading(false);
        return;
      }

      // Find exact rhymes using same rhyme key logic
      const allWords = Object.keys(SAMPLE_RHYMES).concat(Object.values(SAMPLE_RHYMES).flat());
      const exactRhymes: string[] = [];
      const potentialNearRhymes: string[] = [];

      for (const candidateWord of allWords) {
        if (candidateWord.toLowerCase() === cleanWord) continue;
        
        const candidateTokens = tokenize(candidateWord.toLowerCase());
        if (candidateTokens.length === 0) continue;
        
        const candidateKey = rhymeKey(candidateTokens[0].norm);
        if (!candidateKey) continue;

        if (candidateKey === searchKey) {
          exactRhymes.push(candidateWord);
        } else if (candidateKey.length === searchKey.length) {
          // Check for near rhymes (Hamming distance 1)
          const distance = hammingDistance(candidateKey, searchKey);
          if (distance === 1) {
            potentialNearRhymes.push(candidateWord);
          }
        }
      }

      // Remove duplicates and limit results
      const uniqueExactRhymes = [...new Set(exactRhymes)].slice(0, 8);
      const uniqueNearRhymes = [...new Set(potentialNearRhymes)].slice(0, 6);

      setRhymes(uniqueExactRhymes);
      setNearRhymes(uniqueNearRhymes);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = () => {
    findRhymes(searchWord);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleRhyme = (rhyme: string) => {
    setSelectedRhymes(prev => 
      prev.includes(rhyme) 
        ? prev.filter(r => r !== rhyme)
        : [...prev, rhyme]
    );
  };

  const insertSelectedRhymes = () => {
    if (selectedRhymes.length === 0) return;
    
    const rhymeText = selectedRhymes.join(', ');
    if ((window as any).insertIntoLyrics) {
      (window as any).insertIntoLyrics(rhymeText);
    }
    
    setSelectedRhymes([]);
  };

  const clearSelection = () => {
    setSelectedRhymes([]);
  };

  const renderRhymeList = (rhymeList: string[], title: string, subtitle?: string) => (
    <div className="mb-4">
      <h4 className="text-sm dropsource-text-secondary mb-2">
        {title}
        {subtitle && <span className="text-xs ml-1">({subtitle})</span>}
      </h4>
      <div className="space-y-2">
        {rhymeList.map((rhyme, index) => (
          <div
            key={`${title}-${index}`}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedRhymes.includes(rhyme)
                ? 'bg-cyan-900/30 border-cyan-600 dropsource-glow-cyan'
                : 'bg-gray-800/30 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
            onClick={() => toggleRhyme(rhyme)}
          >
            <div className="flex items-center justify-between">
              <span className="dropsource-text-primary font-medium">{rhyme}</span>
              <div className="flex items-center gap-2">
                {selectedRhymes.includes(rhyme) && (
                  <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                    Selected
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if ((window as any).insertIntoLyrics) {
                      (window as any).insertIntoLyrics(rhyme);
                    }
                  }}
                  className="p-1 h-6 w-6 dropsource-text-secondary hover:text-cyan-400"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 h-full overflow-hidden flex flex-col">
      {/* Search Section */}
      <div className="space-y-3 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a word to find rhymes..."
            className="flex-1 bg-gray-900/50 border-gray-700 dropsource-text-primary placeholder:dropsource-text-secondary"
          />
          <Button
            onClick={handleSearch}
            disabled={!searchWord.trim() || isLoading}
            className="dropsource-gradient text-white"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Word Suggestions */}
        <div>
          <h4 className="text-sm dropsource-text-secondary mb-2">Popular words:</h4>
          <div className="flex flex-wrap gap-1">
            {suggestions.map(word => (
              <Button
                key={word}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchWord(word);
                  findRhymes(word);
                }}
                className="text-xs border-gray-600 dropsource-text-secondary hover:text-cyan-400 hover:border-cyan-400"
              >
                {word}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-hidden">
        {searchWord && (
          <div className="mb-3">
            <h3 className="font-medium dropsource-text-primary">
              Rhymes for "{searchWord}"
              {(rhymes.length > 0 || nearRhymes.length > 0) && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {rhymes.length + nearRhymes.length} found
                </Badge>
              )}
            </h3>
          </div>
        )}

        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : (rhymes.length > 0 || nearRhymes.length > 0) ? (
            <div>
              {rhymes.length > 0 && renderRhymeList(rhymes, "Exact Rhymes", "same ending sound")}
              {nearRhymes.length > 0 && renderRhymeList(nearRhymes, "Near Rhymes", "similar ending sound")}
            </div>
          ) : searchWord ? (
            <div className="text-center py-8 dropsource-text-secondary">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No rhymes found for "{searchWord}"</p>
              <p className="text-sm mt-1">Try a different word or check the spelling</p>
            </div>
          ) : (
            <div className="text-center py-8 dropsource-text-secondary">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Enter a word above to find rhymes</p>
              <p className="text-sm mt-1">Try popular words like "love", "heart", or "dream"</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Selected Rhymes Actions */}
      {selectedRhymes.length > 0 && (
        <div className="flex-shrink-0 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm dropsource-text-secondary">
              {selectedRhymes.length} rhyme{selectedRhymes.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-xs dropsource-text-secondary hover:text-red-400"
            >
              Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={insertSelectedRhymes}
              className="flex-1 dropsource-gradient text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Insert Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}