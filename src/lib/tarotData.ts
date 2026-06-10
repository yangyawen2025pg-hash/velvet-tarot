import type { TarotCard } from '@/types';

export const cardBackImage = '/images/card-back.jpg';

// 78张经典韦特塔罗牌数据 - 使用 tarostarot.com CDN
const CDN_BASE = 'https://cdn.tarostarot.com/cards';

export const tarotCards: TarotCard[] = [
  // ===== 大阿尔卡纳 (22张) =====
  { id: '0', name: '愚者', nameEn: 'The Fool', image: `${CDN_BASE}/00-TheFool.webp`, meaning: '新的开始、冒险、纯真', upright: '放下恐惧，拥抱未知的旅程。相信自己，新的篇章即将开启。', keywords: ['开始', '冒险', '自由', '信任'] },
  { id: '1', name: '魔术师', nameEn: 'The Magician', image: `${CDN_BASE}/01-TheMagician.webp`, meaning: '创造力、意志力、显化', upright: '你拥有实现目标所需的一切。集中精力，你的能力超乎想象。', keywords: ['创造', '能力', '行动', '专注'] },
  { id: '2', name: '女祭司', nameEn: 'The High Priestess', image: `${CDN_BASE}/02-TheHighPriestess.webp`, meaning: '直觉、智慧、内在之声', upright: '倾听内心的声音。答案不在外界，而在你深深的内在知晓中。', keywords: ['直觉', '智慧', '内在', '神秘'] },
  { id: '3', name: '女皇', nameEn: 'The Empress', image: `${CDN_BASE}/03-TheEmpress.webp`, meaning: '丰饶、滋养、创造', upright: '拥抱生命的丰盛。关爱自己，让创造力与爱意自然流淌。', keywords: ['丰饶', '关爱', '创造', '自然'] },
  { id: '4', name: '皇帝', nameEn: 'The Emperor', image: `${CDN_BASE}/04-TheEmperor.webp`, meaning: '权威、稳定、掌控', upright: '建立秩序与边界。以智慧和力量引领自己的人生方向。', keywords: ['稳定', '权威', '结构', '控制'] },
  { id: '5', name: '教皇', nameEn: 'The Hierophant', image: `${CDN_BASE}/05-TheHierophant.webp`, meaning: '传统、信仰、指引', upright: '向经验和传统寻求智慧。一位良师益友将为你指引方向。', keywords: ['传统', '信仰', '教导', '精神'] },
  { id: '6', name: '恋人', nameEn: 'The Lovers', image: `${CDN_BASE}/06-TheLovers.webp`, meaning: '爱情、和谐、选择', upright: '跟随你的心做出选择。真挚的连接将带来最深的满足。', keywords: ['爱', '选择', '和谐', '关系'] },
  { id: '7', name: '战车', nameEn: 'The Chariot', image: `${CDN_BASE}/07-TheChariot.webp`, meaning: '意志力、胜利、前进', upright: '以坚定的意志驱动自己前进。胜利属于那些不轻言放弃的人。', keywords: ['意志', '胜利', '前进', '决心'] },
  { id: '8', name: '力量', nameEn: 'Strength', image: `${CDN_BASE}/08-Strength.webp`, meaning: '勇气、耐心、内在力量', upright: '真正的力量来自内心的温柔与坚韧。以耐心和爱驯服困难。', keywords: ['勇气', '耐心', '力量', '温柔'] },
  { id: '9', name: '隐士', nameEn: 'The Hermit', image: `${CDN_BASE}/09-TheHermit.webp`, meaning: '内省、独处、寻求真理', upright: '给自己独处的空间。在安静中，你将找到内心深处的答案。', keywords: ['内省', '独处', '智慧', '指引'] },
  { id: '10', name: '命运之轮', nameEn: 'Wheel of Fortune', image: `${CDN_BASE}/10-WheelOfFortune.webp`, meaning: '变化、命运、周期', upright: '生命的轮子正在转动。拥抱变化，好运正在向你靠近。', keywords: ['变化', '命运', '周期', '好运'] },
  { id: '11', name: '正义', nameEn: 'Justice', image: `${CDN_BASE}/11-Justice.webp`, meaning: '公正、平衡、因果', upright: '真相终将大白。保持公正和诚实，你会得到应有的回报。', keywords: ['公正', '平衡', '真相', '因果'] },
  { id: '12', name: '倒吊人', nameEn: 'The Hanged Man', image: `${CDN_BASE}/12-TheHangedMan.webp`, meaning: '牺牲、换个角度、等待', upright: '有时需要暂停和放手。换个角度看待问题，新的领悟将到来。', keywords: ['牺牲', '等待', '视角', '放手'] },
  { id: '13', name: '死神', nameEn: 'Death', image: `${CDN_BASE}/13-Death.webp`, meaning: '结束、转变、重生', upright: '旧的篇章正在结束，但这正是新生的开始。允许自己蜕变。', keywords: ['结束', '转变', '重生', '释放'] },
  { id: '14', name: '节制', nameEn: 'Temperance', image: `${CDN_BASE}/14-Temperance.webp`, meaning: '平衡、调和、中庸', upright: '在生活中寻找平衡与和谐。融合对立面，创造新的可能。', keywords: ['平衡', '调和', '耐心', '融合'] },
  { id: '15', name: '恶魔', nameEn: 'The Devil', image: `${CDN_BASE}/15-TheDevil.webp`, meaning: '束缚、欲望、阴影面', upright: '觉察是什么在束缚你。你有力量打破枷锁，重获自由。', keywords: ['束缚', '欲望', '觉察', '释放'] },
  { id: '16', name: '塔', nameEn: 'The Tower', image: `${CDN_BASE}/16-TheTower.webp`, meaning: '突变、觉醒、打破旧有', upright: '看似的崩塌其实是必要的清理。在废墟之上，你将重建更真实的自己。', keywords: ['突变', '觉醒', '清理', '重建'] },
  { id: '17', name: '星星', nameEn: 'The Star', image: `${CDN_BASE}/17-TheStar.webp`, meaning: '希望、灵感、宁静', upright: '希望之光照亮前路。保持信念，宇宙正在为你祝福。', keywords: ['希望', '灵感', '宁静', '祝福'] },
  { id: '18', name: '月亮', nameEn: 'The Moon', image: `${CDN_BASE}/18-TheMoon.webp`, meaning: '幻觉、潜意识、不确定性', upright: '直面内心的恐惧与不安。穿越迷雾，你将找到真正的光明。', keywords: ['幻觉', '潜意识', '直觉', '穿越'] },
  { id: '19', name: '太阳', nameEn: 'The Sun', image: `${CDN_BASE}/19-TheSun.webp`, meaning: '喜悦、成功、活力', upright: '阳光普照，温暖与喜悦包围着你。这是享受生命的美好时刻。', keywords: ['喜悦', '成功', '活力', '温暖'] },
  { id: '20', name: '审判', nameEn: 'Judgement', image: `${CDN_BASE}/20-Judgement.webp`, meaning: '觉醒、重生、召唤', upright: '听从内心的召唤。从过去的经验中觉醒，迎接全新的自己。', keywords: ['觉醒', '重生', '召唤', '宽恕'] },
  { id: '21', name: '世界', nameEn: 'The World', image: `${CDN_BASE}/21-TheWorld.webp`, meaning: '完成、圆满、整合', upright: '一个完整的循环即将圆满。你已准备好进入新的阶段。', keywords: ['完成', '圆满', '整合', '成就'] },

  // ===== 权杖 (Wands) - 14张 =====
  { id: 'w1', name: '权杖王牌', nameEn: 'Ace of Wands', image: `${CDN_BASE}/Wands01.webp`, meaning: '创造力、灵感、新开始', upright: '一束创造力的火花正点燃你的热情。抓住这个灵感，勇敢开始。', keywords: ['创造', '灵感', '开始', '热情'] },
  { id: 'w2', name: '权杖二', nameEn: 'Two of Wands', image: `${CDN_BASE}/Wands02.webp`, meaning: '计划、决策、远见', upright: '你站在十字路口，手握选择权。大胆规划，未来在你手中。', keywords: ['计划', '决策', '远见', '选择'] },
  { id: 'w3', name: '权杖三', nameEn: 'Three of Wands', image: `${CDN_BASE}/Wands03.webp`, meaning: '扩张、远见、合作', upright: '你的努力正在开花结果。保持开放的心态，机会将从远方而来。', keywords: ['扩张', '远见', '合作', '成果'] },
  { id: 'w4', name: '权杖四', nameEn: 'Four of Wands', image: `${CDN_BASE}/Wands04.webp`, meaning: '庆祝、家庭、和谐', upright: '值得庆祝的时刻到了。与所爱之人分享喜悦，感受温暖的连接。', keywords: ['庆祝', '家庭', '和谐', '喜悦'] },
  { id: 'w5', name: '权杖五', nameEn: 'Five of Wands', image: `${CDN_BASE}/Wands05.webp`, meaning: '冲突、竞争、挑战', upright: '面对挑战时保持冷静。这些冲突将帮助你成长并找到自己的力量。', keywords: ['冲突', '竞争', '挑战', '成长'] },
  { id: 'w6', name: '权杖六', nameEn: 'Six of Wands', image: `${CDN_BASE}/Wands06.webp`, meaning: '胜利、认可、自信', upright: '你的努力得到了认可。享受这份荣耀，它属于你。', keywords: ['胜利', '认可', '自信', '荣耀'] },
  { id: 'w7', name: '权杖七', nameEn: 'Seven of Wands', image: `${CDN_BASE}/Wands07.webp`, meaning: '防御、坚持、勇气', upright: '为自己的信念站出来。你的坚持将证明你的价值和力量。', keywords: ['防御', '坚持', '勇气', '信念'] },
  { id: 'w8', name: '权杖八', nameEn: 'Eight of Wands', image: `${CDN_BASE}/Wands08.webp`, meaning: '迅速、行动、进展', upright: '事情正在快速推进。抓住 momentum，顺势而为。', keywords: ['迅速', '行动', '进展', ' momentum'] },
  { id: 'w9', name: '权杖九', nameEn: 'Nine of Wands', image: `${CDN_BASE}/Wands09.webp`, meaning: '韧性、坚持、最后防线', upright: '你已经走了很远，不要在此放弃。最后的坚持将带来胜利。', keywords: ['韧性', '坚持', '毅力', '防御'] },
  { id: 'w10', name: '权杖十', nameEn: 'Ten of Wands', image: `${CDN_BASE}/Wands10.webp`, meaning: '负担、责任、压力', upright: '你承担了太多。学会分担和放手，轻装前行才能走得更远。', keywords: ['负担', '责任', '释放', '平衡'] },
  { id: 'wp', name: '权杖侍从', nameEn: 'Page of Wands', image: `${CDN_BASE}/Wands11.webp`, meaning: '探索、热情、新想法', upright: '一颗充满好奇的心正引领你探索新世界。追随你的热情。', keywords: ['探索', '热情', '好奇', '创意'] },
  { id: 'wk', name: '权杖骑士', nameEn: 'Knight of Wands', image: `${CDN_BASE}/Wands12.webp`, meaning: '冒险、冲动、热情', upright: '以热情和勇气追逐你的目标。虽然有些冲动，但行动带来改变。', keywords: ['冒险', '热情', '行动', '勇气'] },
  { id: 'wq', name: '权杖皇后', nameEn: 'Queen of Wands', image: `${CDN_BASE}/Wands13.webp`, meaning: '自信、魅力、独立', upright: '你的内在光芒吸引着周围的一切。自信地展现真实的自己。', keywords: ['自信', '魅力', '独立', '光芒'] },
  { id: 'wkn', name: '权杖国王', nameEn: 'King of Wands', image: `${CDN_BASE}/Wands14.webp`, meaning: '领导力、远见、魄力', upright: '以你的远见和魄力引领方向。你天生就是领导者。', keywords: ['领导', '远见', '魄力', '开创'] },

  // ===== 圣杯 (Cups) - 14张 =====
  { id: 'c1', name: '圣杯王牌', nameEn: 'Ace of Cups', image: `${CDN_BASE}/Cups01.webp`, meaning: '爱、情感、心灵满溢', upright: '爱的源泉正在心中涌动。敞开心扉，接受这份情感的礼物。', keywords: ['爱', '情感', '心灵', '满溢'] },
  { id: 'c2', name: '圣杯二', nameEn: 'Two of Cups', image: `${CDN_BASE}/Cups02.webp`, meaning: '伴侣、和谐、互惠', upright: '一段美好的连接正在形成。相互尊重和理解将带来深刻的关系。', keywords: ['伴侣', '和谐', '互惠', '连接'] },
  { id: 'c3', name: '圣杯三', nameEn: 'Three of Cups', image: `${CDN_BASE}/Cups03.webp`, meaning: '庆祝、友谊、社群', upright: '与朋友们一起庆祝吧。分享快乐会让美好加倍。', keywords: ['庆祝', '友谊', '社群', '快乐'] },
  { id: 'c4', name: '圣杯四', nameEn: 'Four of Cups', image: `${CDN_BASE}/Cups04.webp`, meaning: '沉思、不满足、重新评估', upright: '停下来思考你真正想要的是什么。新的机会可能就在你身边。', keywords: ['沉思', '评估', '觉察', '机会'] },
  { id: 'c5', name: '圣杯五', nameEn: 'Five of Cups', image: `${CDN_BASE}/Cups05.webp`, meaning: '失落、悲伤、接受', upright: '允许自己感受失落，但不要忘记你还拥有的美好。时间会疗愈一切。', keywords: ['失落', '疗愈', '接受', '希望'] },
  { id: 'c6', name: '圣杯六', nameEn: 'Six of Cups', image: `${CDN_BASE}/Cups06.webp`, meaning: '怀旧、童年、回忆', upright: '从过去的回忆中汲取温暖和力量。那份纯真一直存在于你心中。', keywords: ['怀旧', '回忆', '纯真', '温暖'] },
  { id: 'c7', name: '圣杯七', nameEn: 'Seven of Cups', image: `${CDN_BASE}/Cups07.webp`, meaning: '幻想、选择、诱惑', upright: '面对众多选择时，跟随内心最真实的渴望。不要被幻象迷惑。', keywords: ['幻想', '选择', '渴望', '觉察'] },
  { id: 'c8', name: '圣杯八', nameEn: 'Eight of Cups', image: `${CDN_BASE}/Cups08.webp`, meaning: '离开、放下、追寻', upright: '勇敢地放下不再服务你的事物。前方有更值得追寻的东西。', keywords: ['离开', '放下', '追寻', '勇气'] },
  { id: 'c9', name: '圣杯九', nameEn: 'Nine of Cups', image: `${CDN_BASE}/Cups09.webp`, meaning: '满足、幸福、愿望成真', upright: '你的心愿正在实现。享受这份满足感和内心的平静。', keywords: ['满足', '幸福', '愿望', '感恩'] },
  { id: 'c10', name: '圣杯十', nameEn: 'Ten of Cups', image: `${CDN_BASE}/Cups10.webp`, meaning: '家庭幸福、情感圆满、和谐', upright: '情感的圆满正在降临。家庭和睦，内心充满爱与和平。', keywords: ['圆满', '和谐', '家庭', '爱'] },
  { id: 'cp', name: '圣杯侍从', nameEn: 'Page of Cups', image: `${CDN_BASE}/Cups11.webp`, meaning: '直觉、梦想、新情感', upright: '直觉正在向你传递信息。倾听梦中和心中的温柔声音。', keywords: ['直觉', '梦想', '温柔', '创意'] },
  { id: 'ck', name: '圣杯骑士', nameEn: 'Knight of Cups', image: `${CDN_BASE}/Cups12.webp`, meaning: '浪漫、追求、理想主义', upright: '追随内心的浪漫与理想。真诚的情感表达将打开新的门扉。', keywords: ['浪漫', '追求', '真诚', '理想'] },
  { id: 'cq', name: '圣杯皇后', nameEn: 'Queen of Cups', image: `${CDN_BASE}/Cups13.webp`, meaning: '同理心、直觉、情感深度', upright: '你的同理心和直觉是珍贵的礼物。信任你的感受，它们是真实的。', keywords: ['同理心', '直觉', '情感', '深度'] },
  { id: 'ckn', name: '圣杯国王', nameEn: 'King of Cups', image: `${CDN_BASE}/Cups14.webp`, meaning: '情感平衡、慈悲、掌控', upright: '以平静和智慧驾驭情感。你的慈悲之心将指引正确的方向。', keywords: ['平衡', '慈悲', '智慧', '掌控'] },

  // ===== 宝剑 (Swords) - 14张 =====
  { id: 's1', name: '宝剑王牌', nameEn: 'Ace of Swords', image: `${CDN_BASE}/Swords01.webp`, meaning: '清晰、真相、突破', upright: '真理的剑斩断迷雾。清晰的思维将带来突破性的洞察。', keywords: ['清晰', '真相', '突破', '洞察'] },
  { id: 's2', name: '宝剑二', nameEn: 'Two of Swords', image: `${CDN_BASE}/Swords02.webp`, meaning: '僵局、选择、回避', upright: '面对两难的抉择时，摘下眼罩，直面真相。你有智慧做出决定。', keywords: ['僵局', '选择', '直面', '智慧'] },
  { id: 's3', name: '宝剑三', nameEn: 'Three of Swords', image: `${CDN_BASE}/Swords03.webp`, meaning: '心痛、悲伤、释放', upright: '允许自己感受痛苦，这是疗愈的开始。时间会抚平所有伤痕。', keywords: ['心痛', '疗愈', '释放', '接受'] },
  { id: 's4', name: '宝剑四', nameEn: 'Four of Swords', image: `${CDN_BASE}/Swords04.webp`, meaning: '休息、恢复、沉思', upright: '给自己休息和恢复的时间。在宁静中，你的身心将得到疗愈。', keywords: ['休息', '恢复', '宁静', '疗愈'] },
  { id: 's5', name: '宝剑五', nameEn: 'Five of Swords', image: `${CDN_BASE}/Swords05.webp`, meaning: '冲突、 defeat、道德困境', upright: '反思一下：这场"胜利"是否值得？有时放手比赢得更明智。', keywords: ['冲突', '反思', '放手', '智慧'] },
  { id: 's6', name: '宝剑六', nameEn: 'Six of Swords', image: `${CDN_BASE}/Swords06.webp`, meaning: '过渡、离开、疗愈之旅', upright: '放下过去，驶向更平静的水域。疗愈的旅程已经开始。', keywords: ['过渡', '离开', '疗愈', '前进'] },
  { id: 's7', name: '宝剑七', nameEn: 'Seven of Swords', image: `${CDN_BASE}/Swords07.webp`, meaning: '策略、隐秘、独立', upright: '用智慧和策略应对挑战。有时需要另辟蹊径来解决问题。', keywords: ['策略', '智慧', '灵活', '独立'] },
  { id: 's8', name: '宝剑八', nameEn: 'Eight of Swords', image: `${CDN_BASE}/Swords08.webp`, meaning: '限制、束缚、自我设限', upright: '你以为是束缚的东西，其实是可以走开的。你比自己想象的更自由。', keywords: ['限制', '觉察', '自由', '解脱'] },
  { id: 's9', name: '宝剑九', nameEn: 'Nine of Swords', image: `${CDN_BASE}/Swords09.webp`, meaning: '焦虑、噩梦、担忧', upright: '你的担忧大多是想象出来的。深呼吸，一切都会好起来的。', keywords: ['焦虑', '担忧', '面对', '平静'] },
  { id: 's10', name: '宝剑十', nameEn: 'Ten of Swords', image: `${CDN_BASE}/Swords10.webp`, meaning: '结束、低谷、新开始', upright: '最黑暗的时刻已经过去。在最底处，唯一的方向就是向上。', keywords: ['结束', '低谷', '重生', '希望'] },
  { id: 'sp', name: '宝剑侍从', nameEn: 'Page of Swords', image: `${CDN_BASE}/Swords11.webp`, meaning: '好奇、警觉、新想法', upright: '保持好奇和警觉。新的信息和想法正在向你靠近。', keywords: ['好奇', '警觉', '想法', '沟通'] },
  { id: 'sk', name: '宝剑骑士', nameEn: 'Knight of Swords', image: `${CDN_BASE}/Swords12.webp`, meaning: '果断、行动、追求真相', upright: '以决心和速度追求真相。果断行动将带来你想要的结果。', keywords: ['果断', '行动', '真相', '决心'] },
  { id: 'sq', name: '宝剑皇后', nameEn: 'Queen of Swords', image: `${CDN_BASE}/Swords13.webp`, meaning: '独立、清晰、理性', upright: '以清晰的头脑和独立的判断面对一切。诚实是最好的策略。', keywords: ['独立', '清晰', '理性', '诚实'] },
  { id: 'skn', name: '宝剑国王', nameEn: 'King of Swords', image: `${CDN_BASE}/Swords14.webp`, meaning: '权威、公正、智慧', upright: '以智慧和公正做出决策。你的判断力和领导力令人信赖。', keywords: ['权威', '公正', '智慧', '领导力'] },

  // ===== 星币 (Pentacles) - 14张 =====
  { id: 'p1', name: '星币王牌', nameEn: 'Ace of Pentacles', image: `${CDN_BASE}/Pentacles01.webp`, meaning: '物质机会、繁荣、实现', upright: '物质世界的大门正在打开。抓住这个机会，播下繁荣的种子。', keywords: ['机会', '繁荣', '实现', '物质'] },
  { id: 'p2', name: '星币二', nameEn: 'Two of Pentacles', image: `${CDN_BASE}/Pentacles02.webp`, meaning: '平衡、 juggling、适应', upright: '在生活的各个方面寻找平衡。你的适应能力将帮助你应对变化。', keywords: ['平衡', '适应', '灵活', '管理'] },
  { id: 'p3', name: '星币三', nameEn: 'Three of Pentacles', image: `${CDN_BASE}/Pentacles03.webp`, meaning: '合作、技能、团队', upright: '你的才能正在被认可。与他人合作，共同创造美好的成果。', keywords: ['合作', '技能', '团队', '认可'] },
  { id: 'p4', name: '星币四', nameEn: 'Four of Pentacles', image: `${CDN_BASE}/Pentacles04.webp`, meaning: '保守、控制、安全感', upright: '安全感很重要，但不要让它变成控制。适度放手，让能量流动。', keywords: ['保守', '安全', '控制', '流动'] },
  { id: 'p5', name: '星币五', nameEn: 'Five of Pentacles', image: `${CDN_BASE}/Pentacles05.webp`, meaning: '困难、匮乏、孤立', upright: '困难是暂时的。寻求帮助并不可耻，你周围有关心你的人。', keywords: ['困难', '求助', '希望', '支持'] },
  { id: 'p6', name: '星币六', nameEn: 'Six of Pentacles', image: `${CDN_BASE}/Pentacles06.webp`, meaning: '慷慨、给予、互惠', upright: '分享你的资源和时间。给予和接受都是生命中美好的循环。', keywords: ['慷慨', '给予', '互惠', '分享'] },
  { id: 'p7', name: '星币七', nameEn: 'Seven of Pentacles', image: `${CDN_BASE}/Pentacles07.webp`, meaning: '评估、耐心、成长', upright: '停下来评估你的成果。耐心等待，你的努力终将开花结果。', keywords: ['评估', '耐心', '成长', '收获'] },
  { id: 'p8', name: '星币八', nameEn: 'Eight of Pentacles', image: `${CDN_BASE}/Pentacles08.webp`, meaning: '专注、勤奋、精通', upright: '专注于你的工作和技能提升。勤奋的练习将带来精通和成就。', keywords: ['专注', '勤奋', '精通', '技艺'] },
  { id: 'p9', name: '星币九', nameEn: 'Nine of Pentacles', image: `${CDN_BASE}/Pentacles09.webp`, meaning: '独立、自给、享受', upright: '享受你辛勤劳动的成果。你值得这份舒适和优雅的生活。', keywords: ['独立', '享受', '优雅', '成果'] },
  { id: 'p10', name: '星币十', nameEn: 'Ten of Pentacles', image: `${CDN_BASE}/Pentacles10.webp`, meaning: '遗产、家庭、长期成功', upright: '长期的成功和稳定正在建立。为你的未来和家人创造坚实的根基。', keywords: ['遗产', '家庭', '成功', '根基'] },
  { id: 'pp', name: '星币侍从', nameEn: 'Page of Pentacles', image: `${CDN_BASE}/Pentacles11.webp`, meaning: '学习、机会、新计划', upright: '新的学习机会和计划正在出现。以务实的态度追求你的目标。', keywords: ['学习', '机会', '计划', '务实'] },
  { id: 'pk', name: '星币骑士', nameEn: 'Knight of Pentacles', image: `${CDN_BASE}/Pentacles12.webp`, meaning: '勤奋、可靠、坚持', upright: '以踏实的态度稳步前进。可靠和坚持是你最大的优点。', keywords: ['勤奋', '可靠', '坚持', '踏实'] },
  { id: 'pq', name: '星币皇后', nameEn: 'Queen of Pentacles', image: `${CDN_BASE}/Pentacles13.webp`, meaning: '滋养、实际、富足', upright: '以实际和温柔的方式滋养自己和他人。你拥有创造富足的能力。', keywords: ['滋养', '实际', '富足', '温暖'] },
  { id: 'pkn', name: '星币国王', nameEn: 'King of Pentacles', image: `${CDN_BASE}/Pentacles14.webp`, meaning: '成功、稳定、领导力', upright: '以智慧和经验驾驭物质世界。你的稳定和成功令人羡慕。', keywords: ['成功', '稳定', '领导力', '智慧'] },
];

export function drawRandomCards(count: number = 3): TarotCard[] {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 四牌阵位置含义
export const fourCardSpread = [
  { position: 1, label: '第一张', question: '我现在的情绪' },
  { position: 2, label: '第二张', question: '为什么会这样' },
  { position: 3, label: '第三张', question: '我忽略了什么' },
  { position: 4, label: '第四张', question: '我该如何照顾自己' },
];

// 心情关键词映射 - 扩展版
const moodKeywordMap: Record<string, number> = {
  // 积极情绪 (+)
  '开心': 25, '快乐': 25, '幸福': 30, '满足': 20, '感恩': 28,
  '平静': 18, '安宁': 18, '舒服': 15, '轻松': 16, '自在': 17,
  '期待': 20, '兴奋': 22, '希望': 24, '憧憬': 21, '喜欢': 20,
  '爱': 26, '温暖': 22, '感动': 24, '安心': 19, '充实': 20,
  '自豪': 23, '自信': 22, '勇敢': 21, '坚定': 18, '好': 10,
  '不错': 8, '还行': 5, '可以': 5, '棒': 20, '优秀': 18,
  '美好': 22, '美丽': 15, '宁静': 16, '祥和': 18,
  '甜蜜': 20, '愉快': 18, '欢喜': 22, '欣喜': 24, '乐观': 20,
  '积极': 18, '向上': 15, '阳光': 16, '开朗': 18, '洒脱': 15,
  '惬意': 16, '享受': 15, '得意': 10, '欣慰': 20, '释然': 22,
  '放心': 16, '踏实': 14, '稳定': 12, '安全': 14, '被爱的': 25,
  '被理解': 22, '被接纳': 24, '自由': 18, '轻盈': 16, '清新': 14,
  '活力': 18, '能量': 16, '热情': 15, '激情': 12, '浪漫': 14,
  '温柔': 16, '善良': 18,
  // 消极情绪 (-)
  '难过': -20, '伤心': -22, '痛苦': -25, '悲伤': -20,
  '焦虑': -15, '担心': -12, '紧张': -10, '不安': -13,
  '生气': -18, '愤怒': -22, '烦躁': -14, '不满': -12,
  '累': -10, '疲惫': -12, '无力': -15, '困倦': -8,
  '孤独': -16, '寂寞': -15, '失落': -14,
  '害怕': -18, '恐惧': -20, '担忧': -12,
  '坏': -8, '糟': -10, '差': -8, '难受': -15,
  '压抑': -18, '郁闷': -16, '沮丧': -18, '灰心': -15,
  '绝望': -25, '无助': -20, '迷茫': -16, '困惑': -12,
  '纠结': -10, '矛盾': -8, '怀疑': -10,
  '压力': -15, '沉重': -18, '负担': -16,
  '伤害': -20, '背叛': -25, '欺骗': -20,
  '失望': -18, '遗憾': -15, '后悔': -16, '内疚': -18,
  '羞耻': -20, '自卑': -18, '倦怠': -14,
  '麻木': -12, '空虚': -18, '无聊': -8, '厌倦': -10,
  '烦': -12, '恼': -10, '憎': -20, '恨': -22,
  '嫉妒': -16, '羡慕': -8, '恐慌': -20,
  '应激': -14, '敏感': -10, '脆弱': -12,
  '精疲力竭': -20, '心力交瘁': -22, '崩溃': -25,
  '想死': -30, '自杀': -30, '活着没意思': -28,
  '没人爱我': -25, '被抛弃': -22, '不被理解': -18,
  '失败': -20, ' loser': -18, '废物': -22, '没用': -20,
};

export function analyzeMood(text: string): { score: number; keywords: string[]; sentiment: 'positive' | 'negative' | 'neutral' } {
  let score = 50;
  const foundKeywords: string[] = [];

  for (const [keyword, value] of Object.entries(moodKeywordMap)) {
    if (text.includes(keyword)) {
      score += value;
      foundKeywords.push(keyword);
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (finalScore >= 60) sentiment = 'positive';
  else if (finalScore <= 40) sentiment = 'negative';

  return { score: finalScore, keywords: foundKeywords, sentiment };
}

// 获取心情标签
export function getMoodLabel(score: number): string {
  if (score >= 90) return '光芒万丈';
  if (score >= 80) return '心花怒放';
  if (score >= 70) return '温暖平和';
  if (score >= 60) return '轻松愉快';
  if (score >= 50) return '平静如水';
  if (score >= 40) return '略带疲惫';
  if (score >= 30) return '需要抱抱';
  if (score >= 20) return '心情低落';
  if (score >= 10) return '需要关爱';
  return '请寻求帮助';
}

// 获取鼓励话语
export function getEncouragement(score: number): string {
  if (score >= 80) return '你今天的光芒照亮了整个世界，继续保持这份美好吧！';
  if (score >= 70) return '你正处于一个很好的状态，这份平和是最珍贵的礼物。';
  if (score >= 60) return '生活中总有小确幸，你今天抓住了它们，真棒！';
  if (score >= 50) return '平淡也是一种幸福，给自己一个大大的拥抱吧。';
  if (score >= 40) return '累了就休息一下，你不需要一直坚强，允许自己放慢脚步。';
  if (score >= 30) return '无论今天发生了什么，请记得：你值得被温柔以待。';
  if (score >= 20) return '黑暗只是暂时的，明天的太阳依旧会升起。你比自己想象的更坚强。';
  return '请记得，你并不孤单。每一个生命都是独一无二的奇迹，包括你。如果感到太难受，请寻求专业帮助。';
}

// 周最低分鼓励语
export function getWeeklyLowEncouragement(): string {
  const messages = [
    '这周虽然有过低谷，但你走过来了。每一次跌倒都是成长的机会。',
    ' darkest moment is just before dawn. 你比自己想象的更勇敢。',
    '生活中难免有风雨，但请相信：雨后的彩虹只属于那些坚持到最后的人。',
    '这一周辛苦了。请温柔地对待自己，就像对待最珍贵的朋友一样。',
    '低谷不是终点，而是新的起点。你已经很棒了，真的。',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// 每日推送消息
export function getDailyNotification(score: number, dayOfWeek: number): string | null {
  if (dayOfWeek !== 0) return null; // 只在周日推送
  if (score >= 70) return '本周你的心情像阳光一样灿烂！新的一周继续发光吧✨';
  if (score >= 50) return '本周整体平稳，记得给自己留一些温柔的时光🌸';
  return '本周你经历了一些起伏，但请记住：你有足够的力量面对一切💪';
}
