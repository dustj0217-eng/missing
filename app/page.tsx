"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Copy,
  Home,
  ImagePlus,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trophy,
  X,
} from "lucide-react";

type MainScreen = "home" | "search" | "create" | "chats" | "profile";
type Screen = MainScreen | "detail" | "chat";
type PostType = "lost" | "found";
type LocationGroup = "학교" | "학교 외";
type StorageType = "left" | "keeping" | "school" | "police";

type Post = {
  id: number;
  type: PostType;
  itemType: string;
  title: string;
  locationGroup: LocationGroup;
  location: string;
  detailLocation: string;
  date: string;
  time: string;
  description: string;
  featureTags: string[];
  owner: string;
  verified?: boolean;
  storageType?: StorageType;
  storageDetail?: string;
  createdLabel: string;
};

type Conversation = {
  id: number;
  postId: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
};

type ChatMessage = {
  id: number;
  mine: boolean;
  text: string;
  time: string;
};

const BASE_ITEM_TYPES = [
  "에어팟·이어폰",
  "카드",
  "학생증·신분증",
  "지갑",
  "우산",
  "열쇠",
  "충전기",
  "텀블러",
  "가방",
];

const SCHOOL_LOCATIONS = ["명신관", "순헌관", "학생회관", "도서관", "프라임관", "진리관"];
const OUTSIDE_LOCATIONS = ["숙대입구역", "남영역", "효창공원", "학교 앞 상가", "청파동"];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    type: "lost",
    itemType: "에어팟·이어폰",
    title: "에어팟 프로 2세대",
    locationGroup: "학교",
    location: "명신관",
    detailLocation: "3층 308호 앞 복도",
    date: "2026-09-22",
    time: "13:20",
    description: "흰색 케이스에 작은 토끼 키링이 달려 있어요. 308호 수업 전까지는 가지고 있었습니다.",
    featureTags: ["흰색 케이스", "토끼 키링"],
    owner: "김수민",
    verified: true,
    createdLabel: "28분 전",
  },
  {
    id: 2,
    type: "found",
    itemType: "카드",
    title: "파란색 체크카드",
    locationGroup: "학교 외",
    location: "숙대입구역",
    detailLocation: "10번 출구 계단 아래",
    date: "2026-09-22",
    time: "11:05",
    description: "카드 이름과 번호는 가려 두었습니다. 카드사 색상은 파란색 계열이에요.",
    featureTags: ["파란색", "체크카드"],
    owner: "박하늘",
    verified: true,
    storageType: "police",
    storageDetail: "숙대입구역 역무실",
    createdLabel: "2시간 전",
  },
  {
    id: 3,
    type: "lost",
    itemType: "학생증·신분증",
    title: "투명 카드지갑 속 학생증",
    locationGroup: "학교",
    location: "순헌관",
    detailLocation: "1층 로비 또는 카페 앞",
    date: "2026-09-21",
    time: "18:40",
    description: "투명 카드지갑 안에 학생증과 교통카드가 같이 있습니다. 검정 스트랩이 달려 있어요.",
    featureTags: ["투명 카드지갑", "검정 스트랩"],
    owner: "이서연",
    createdLabel: "어제",
  },
  {
    id: 4,
    type: "found",
    itemType: "우산",
    title: "검정색 장우산",
    locationGroup: "학교",
    location: "도서관",
    detailLocation: "2층 창가 좌석 옆",
    date: "2026-09-21",
    time: "15:10",
    description: "손잡이에 작은 은색 스티커가 붙어 있습니다.",
    featureTags: ["검정", "장우산", "은색 스티커"],
    owner: "정다은",
    storageType: "school",
    storageDetail: "도서관 1층 안내데스크",
    createdLabel: "어제",
  },
  {
    id: 5,
    type: "found",
    itemType: "텀블러",
    title: "아이보리색 텀블러",
    locationGroup: "학교",
    location: "학생회관",
    detailLocation: "2층 소파 옆 테이블",
    date: "2026-09-22",
    time: "09:30",
    description: "스티커가 여러 개 붙어 있고 뚜껑은 검정색입니다.",
    featureTags: ["아이보리", "스티커"],
    owner: "한유진",
    storageType: "left",
    storageDetail: "발견한 2층 소파 옆 테이블에 그대로 두었습니다.",
    createdLabel: "4시간 전",
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: 101, postId: 1, name: "김수민", lastMessage: "네, 토끼 키링이 달려 있어요!", time: "14:19", unread: 2, online: true },
  { id: 102, postId: 2, name: "박하늘", lastMessage: "역무실에 맡겨두었습니다.", time: "12:42", unread: 0 },
  { id: 103, postId: 4, name: "정다은", lastMessage: "손잡이 사진도 확인 가능할까요?", time: "어제", unread: 1 },
  { id: 104, postId: 3, name: "이서연", lastMessage: "혹시 순헌관 카페 쪽도 보셨나요?", time: "월", unread: 0 },
];

const INITIAL_MESSAGES: Record<number, ChatMessage[]> = {
  101: [
    { id: 1, mine: false, text: "안녕하세요. 명신관에서 에어팟 찾고 계신 분 맞으시죠?", time: "14:12" },
    { id: 2, mine: true, text: "네 맞아요! 혹시 보셨나요?", time: "14:14" },
    { id: 3, mine: false, text: "흰색 케이스에 작은 키링이 달려 있었어요.", time: "14:17" },
    { id: 4, mine: false, text: "네, 토끼 키링이 달려 있어요!", time: "14:19" },
  ],
  102: [
    { id: 1, mine: true, text: "카드 습득 글 보고 연락드렸어요.", time: "12:30" },
    { id: 2, mine: false, text: "역무실에 맡겨두었습니다.", time: "12:42" },
  ],
  103: [
    { id: 1, mine: false, text: "제가 찾는 우산이랑 비슷한 것 같아요.", time: "어제 16:02" },
    { id: 2, mine: true, text: "손잡이 사진도 확인 가능할까요?", time: "어제 16:05" },
  ],
  104: [{ id: 1, mine: false, text: "혹시 순헌관 카페 쪽도 보셨나요?", time: "월 18:22" }],
};

const PHOTO_GUIDES: Record<string, string> = {
  "에어팟·이어폰": "케이스 전체 모양, 키링·스티커·흠집처럼 구별 가능한 특징이 보이게 찍어주세요. 시리얼 번호는 노출하지 않는 편이 좋아요.",
  카드: "카드 색상과 전체 형태만 보이게 찍고, 이름·카드번호·유효기간 등 개인정보는 반드시 가려주세요.",
  "학생증·신분증": "이름, 학번·주민번호, 얼굴 사진 등 개인정보는 가리고 카드지갑·스트랩 같은 외형 특징 위주로 찍어주세요.",
  지갑: "지갑의 앞·뒤 형태, 색상, 로고나 스크래치처럼 구별 가능한 특징을 찍어주세요. 내부 개인정보는 보이지 않게 해주세요.",
  우산: "우산 전체 길이, 손잡이 모양, 무늬·스티커처럼 구별 가능한 특징이 함께 보이게 찍어주세요.",
  열쇠: "열쇠 자체보다 키링, 장식, 색상처럼 소유자가 알아볼 수 있는 특징이 잘 보이게 찍어주세요.",
  충전기: "케이블 길이, 어댑터 형태, 스티커나 사용 흔적 등 다른 충전기와 구별되는 부분을 함께 찍어주세요.",
  텀블러: "전체 색상과 형태, 브랜드 로고, 스티커나 흠집처럼 구별 가능한 특징이 보이게 찍어주세요.",
  가방: "가방 전체 형태와 색상, 로고, 키링·뱃지처럼 구별 가능한 특징을 앞뒤로 찍어주세요.",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function storageLabel(type?: StorageType) {
  if (type === "left") return "그 자리에 두었어요";
  if (type === "keeping") return "습득자가 보관 중";
  if (type === "school") return "학교 시설에 맡겼어요";
  if (type === "police") return "경찰서·지구대 등에 맡겼어요";
  return "";
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lastMainScreen, setLastMainScreen] = useState<MainScreen>("home");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [itemTypes, setItemTypes] = useState<string[]>(BASE_ITEM_TYPES);
  const [selectedPostId, setSelectedPostId] = useState(1);
  const [createInitialType, setCreateInitialType] = useState<PostType>("lost");
  const [locationFilter, setLocationFilter] = useState<"전체" | LocationGroup>("전체");
  const [itemFilter, setItemFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>(INITIAL_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [customItem, setCustomItem] = useState("");
  const [sheet, setSheet] = useState<"notifications" | "share" | "points" | null>(null);
  const [toast, setToast] = useState("");

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? posts[0];

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const locationOk = locationFilter === "전체" || post.locationGroup === locationFilter;
      const itemOk = itemFilter === "전체" || post.itemType === itemFilter;
      const queryOk =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.itemType.toLowerCase().includes(q) ||
        post.location.toLowerCase().includes(q) ||
        post.detailLocation.toLowerCase().includes(q) ||
        post.featureTags.some((tag) => tag.toLowerCase().includes(q));
      return locationOk && itemOk && queryOk;
    });
  }, [posts, locationFilter, itemFilter, searchQuery]);

  function notify(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 1700);
  }

  function goMain(next: MainScreen) {
    setLastMainScreen(next);
    setScreen(next);
  }

  function openCreate(type: PostType) {
    setCreateInitialType(type);
    setScreen("create");
  }

  function openDetail(postId: number) {
    setSelectedPostId(postId);
    setScreen("detail");
  }

  function openChatFromPost(post: Post) {
    const existing = conversations.find((conversation) => conversation.postId === post.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setConversations((prev) => prev.map((item) => (item.id === existing.id ? { ...item, unread: 0 } : item)));
      setScreen("chat");
      return;
    }

    const newId = Date.now();
    const conversation: Conversation = {
      id: newId,
      postId: post.id,
      name: post.owner,
      lastMessage: "대화를 시작해 보세요.",
      time: "방금",
      unread: 0,
    };
    setConversations((prev) => [conversation, ...prev]);
    setMessages((prev) => ({ ...prev, [newId]: [] }));
    setActiveConversationId(newId);
    setScreen("chat");
  }

  function addCustomItemType(value: string) {
    const normalized = value.trim();
    if (!normalized) return;
    setItemTypes((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  }

  function addFilterItem() {
    const value = customItem.trim();
    if (!value) return;
    addCustomItemType(value);
    setItemFilter(value);
    setCustomItem("");
    setShowCustomItem(false);
  }

  async function copyShare(post: Post) {
    const location = `${post.location}${post.detailLocation ? ` · ${post.detailLocation}` : ""}`;
    const storage = post.type === "found" && post.storageDetail ? `\n📦 보관: ${post.storageDetail}` : "";
    const text = `${post.type === "lost" ? "📢 분실물을 찾습니다" : "📢 습득물을 찾고 있어요"}\n\n${post.title}\n📍 ${location}\n📅 ${post.date} ${post.time}${storage}\n🔎 ${post.description}\n\n#${post.itemType.replaceAll(" ", "_")} ${post.featureTags.map((tag) => `#${tag.replaceAll(" ", "_")}`).join(" ")}\n\n교내 분실물 앱에서 자세히 확인해 주세요.`;
    try {
      await navigator.clipboard.writeText(text);
      notify("공유 문구를 복사했어요");
      setSheet(null);
    } catch {
      notify("클립보드를 사용할 수 없어요");
    }
  }

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;

  return (
    <main className="min-h-screen bg-[#eef0f3] text-[#17181c] antialiased">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-white shadow-[0_0_36px_rgba(18,24,40,0.08)]">
        {screen === "home" && (
          <HomeScreen
            posts={filteredPosts}
            itemTypes={itemTypes}
            locationFilter={locationFilter}
            itemFilter={itemFilter}
            searchQuery={searchQuery}
            onSearchQuery={setSearchQuery}
            onLocationFilter={setLocationFilter}
            onItemFilter={setItemFilter}
            onCustomItem={() => setShowCustomItem(true)}
            onSearch={() => goMain("search")}
            onCreate={openCreate}
            onDetail={openDetail}
            onNotifications={() => setSheet("notifications")}
          />
        )}

        {screen === "search" && (
          <SearchScreen
            posts={filteredPosts}
            itemTypes={itemTypes}
            locationFilter={locationFilter}
            itemFilter={itemFilter}
            searchQuery={searchQuery}
            onSearchQuery={setSearchQuery}
            onLocationFilter={setLocationFilter}
            onItemFilter={setItemFilter}
            onCustomItem={() => setShowCustomItem(true)}
            onDetail={openDetail}
          />
        )}

        {screen === "create" && (
          <CreateScreen
            initialType={createInitialType}
            itemTypes={itemTypes}
            onAddItemType={addCustomItemType}
            onClose={() => setScreen(lastMainScreen)}
            onSubmit={(post) => {
              const newPost: Post = { ...post, id: Date.now(), createdLabel: "방금 전", owner: "나", verified: true };
              setPosts((prev) => [newPost, ...prev]);
              setSelectedPostId(newPost.id);
              notify("게시글을 등록했어요");
              setScreen("detail");
            }}
          />
        )}

        {screen === "detail" && (
          <DetailScreen
            post={selectedPost}
            onBack={() => setScreen(lastMainScreen)}
            onChat={() => openChatFromPost(selectedPost)}
            onShare={() => setSheet("share")}
            onComplete={() => notify("완료 상태로 변경했어요")}
          />
        )}

        {screen === "chats" && (
          <ChatListScreen
            conversations={conversations}
            posts={posts}
            onOpen={(conversationId) => {
              setActiveConversationId(conversationId);
              setConversations((prev) => prev.map((item) => (item.id === conversationId ? { ...item, unread: 0 } : item)));
              setScreen("chat");
            }}
          />
        )}

        {screen === "chat" && activeConversation && (
          <ChatRoomScreen
            conversation={activeConversation}
            post={posts.find((post) => post.id === activeConversation.postId) ?? posts[0]}
            messages={messages[activeConversation.id] ?? []}
            onBack={() => goMain("chats")}
            onPost={() => openDetail(activeConversation.postId)}
            onSend={(text) => {
              const newMessage: ChatMessage = { id: Date.now(), mine: true, text, time: "방금" };
              setMessages((prev) => ({ ...prev, [activeConversation.id]: [...(prev[activeConversation.id] ?? []), newMessage] }));
              setConversations((prev) =>
                prev.map((item) =>
                  item.id === activeConversation.id ? { ...item, lastMessage: text, time: "방금", unread: 0 } : item,
                ),
              );
            }}
            onPhoto={() => notify("사진 첨부 UI를 열었어요")}
          />
        )}

        {screen === "profile" && (
          <ProfileScreen
            posts={posts.filter((post) => post.owner === "나")}
            onDetail={openDetail}
            onPoints={() => setSheet("points")}
            onNotice={() => notify("알림 설정을 변경했어요")}
          />
        )}

        {(screen === "home" || screen === "search" || screen === "chats" || screen === "profile") && (
          <BottomNav screen={screen} onNavigate={goMain} onCreate={() => openCreate("lost")} />
        )}

        {showCustomItem && (
          <SimpleModal
            title="물건 종류 추가"
            description="목록에 없는 물건을 직접 등록하면 필터와 글 작성 화면에 바로 추가됩니다."
            value={customItem}
            placeholder="예: 목도리, 안경, 필통"
            onChange={setCustomItem}
            onClose={() => setShowCustomItem(false)}
            onSubmit={addFilterItem}
            submitLabel="추가하기"
          />
        )}

        {sheet === "notifications" && (
          <BottomSheet title="알림" onClose={() => setSheet(null)}>
            <div className="space-y-2">
              <NoticeItem title="비슷한 습득물이 등록됐어요" body="명신관에서 에어팟 습득 글이 새로 올라왔습니다." time="12분 전" />
              <NoticeItem title="새 메시지가 도착했어요" body="김수민 님이 에어팟 특징을 확인해 달라고 했어요." time="28분 전" />
              <NoticeItem title="게시글 만료 예정" body="분실 게시글이 3일 뒤 자동 정리될 예정입니다." time="어제" />
            </div>
          </BottomSheet>
        )}

        {sheet === "share" && (
          <BottomSheet title="게시글 공유" onClose={() => setSheet(null)}>
            <div className="rounded-[24px] bg-[#f5f6f8] p-4">
              <p className="text-[13px] font-semibold text-[#7a7f88]">에타·SNS용 미리보기</p>
              <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-[#30333a]">
                {`${selectedPost.type === "lost" ? "📢 분실물을 찾습니다" : "📢 습득물을 찾고 있어요"}\n${selectedPost.title}\n📍 ${selectedPost.location} · ${selectedPost.detailLocation}\n📅 ${selectedPost.date} ${selectedPost.time}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyShare(selectedPost)}
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#17181c] text-[15px] font-semibold text-white active:scale-[0.99]"
            >
              <Copy size={18} /> 글 그대로 복사하기
            </button>
          </BottomSheet>
        )}

        {sheet === "points" && (
          <BottomSheet title="포인트 사용" onClose={() => setSheet(null)}>
            <div className="rounded-[24px] bg-[#f5f6f8] p-5">
              <p className="text-[13px] text-[#7a7f88]">현재 보유 포인트</p>
              <p className="mt-1 text-[28px] font-bold tracking-[-0.04em]">1,240 P</p>
              <p className="mt-3 text-[14px] leading-6 text-[#636872]">300P를 사용하면 내 분실 게시글을 24시간 동안 검색 상단에 노출할 수 있어요.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSheet(null);
                notify("상위 노출을 적용했어요");
              }}
              className="mt-3 h-14 w-full rounded-[18px] bg-[#17181c] text-[15px] font-semibold text-white active:scale-[0.99]"
            >
              300P 사용하기
            </button>
          </BottomSheet>
        )}

        {toast && (
          <div className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[#17181c] px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}

function HomeScreen({
  posts,
  itemTypes,
  locationFilter,
  itemFilter,
  searchQuery,
  onSearchQuery,
  onLocationFilter,
  onItemFilter,
  onCustomItem,
  onSearch,
  onCreate,
  onDetail,
  onNotifications,
}: {
  posts: Post[];
  itemTypes: string[];
  locationFilter: "전체" | LocationGroup;
  itemFilter: string;
  searchQuery: string;
  onSearchQuery: (value: string) => void;
  onLocationFilter: (value: "전체" | LocationGroup) => void;
  onItemFilter: (value: string) => void;
  onCustomItem: () => void;
  onSearch: () => void;
  onCreate: (type: PostType) => void;
  onDetail: (id: number) => void;
  onNotifications: () => void;
}) {
  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pb-5 pt-5">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#17181c] px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-white">FOUND</span>
              <span className="text-[12px] font-semibold text-[#91959d]">교내 분실물</span>
            </div>
            <h1 className="mt-3 text-[26px] font-bold tracking-[-0.045em]">찾는 시간을 줄여드릴게요.</h1>
          </div>
          <button type="button" onClick={onNotifications} className="relative grid size-11 place-items-center rounded-full bg-[#f4f5f7] active:scale-95">
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#ff5b5b]" />
          </button>
        </header>

        <button
          type="button"
          onClick={onSearch}
          className="mt-6 flex h-14 w-full items-center gap-3 rounded-[20px] bg-[#f4f5f7] px-4 text-left active:scale-[0.995]"
        >
          <Search size={19} className="text-[#777c85]" />
          <span className={cn("flex-1 text-[15px]", searchQuery ? "font-medium text-[#272a30]" : "text-[#90949c]")}>{searchQuery || "물건명, 장소, 특징으로 검색"}</span>
          <SlidersHorizontal size={18} className="text-[#777c85]" />
        </button>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => onCreate("lost")} className="rounded-[24px] bg-[#eef3ff] p-4 text-left active:scale-[0.985]">
            <div className="grid size-10 place-items-center rounded-full bg-white text-[#315fd6] shadow-sm"><Search size={19} /></div>
            <p className="mt-5 text-[17px] font-bold tracking-[-0.03em]">분실했어요</p>
            <p className="mt-1 text-[12px] leading-5 text-[#687080]">잃어버린 물건을 등록하고<br />비슷한 습득물을 찾아보세요.</p>
          </button>
          <button type="button" onClick={() => onCreate("found")} className="rounded-[24px] bg-[#eff8f2] p-4 text-left active:scale-[0.985]">
            <div className="grid size-10 place-items-center rounded-full bg-white text-[#26825a] shadow-sm"><Sparkles size={19} /></div>
            <p className="mt-5 text-[17px] font-bold tracking-[-0.03em]">주웠어요</p>
            <p className="mt-1 text-[12px] leading-5 text-[#687080]">발견 위치와 보관 상태를 남겨<br />주인에게 알려주세요.</p>
          </button>
        </div>
      </div>

      <section className="mt-2 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold">어디에서 찾을까요?</h2>
          <button type="button" onClick={onSearch} className="text-[12px] font-semibold text-[#777c85]">상세 검색</button>
        </div>
        <div className="mt-3 flex gap-2">
          {(["전체", "학교", "학교 외"] as const).map((item) => (
            <FilterChip key={item} label={item} active={locationFilter === item} onClick={() => onLocationFilter(item)} />
          ))}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip label="전체 물건" active={itemFilter === "전체"} onClick={() => onItemFilter("전체")} />
          {itemTypes.map((item) => <FilterChip key={item} label={item} active={itemFilter === item} onClick={() => onItemFilter(item)} />)}
          <button type="button" onClick={onCustomItem} className="shrink-0 rounded-full bg-[#f4f5f7] px-3.5 py-2 text-[12px] font-semibold text-[#525761] active:scale-95">+ 직접 추가</button>
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[#8a8f98]">최근 등록</p>
            <h2 className="mt-1 text-[20px] font-bold tracking-[-0.035em]">지금 올라온 분실·습득물</h2>
          </div>
          <span className="text-[12px] font-semibold text-[#a0a4ab]">{posts.length}개</span>
        </div>

        <div className="mt-4 space-y-3">
          {posts.slice(0, 5).map((post) => <PostCard key={post.id} post={post} onClick={() => onDetail(post.id)} />)}
          {posts.length === 0 && <EmptyState title="조건에 맞는 게시물이 없어요" body="필터를 바꾸거나 직접 물건 종류를 추가해 보세요." />}
        </div>
      </section>
    </div>
  );
}

function SearchScreen({
  posts,
  itemTypes,
  locationFilter,
  itemFilter,
  searchQuery,
  onSearchQuery,
  onLocationFilter,
  onItemFilter,
  onCustomItem,
  onDetail,
}: {
  posts: Post[];
  itemTypes: string[];
  locationFilter: "전체" | LocationGroup;
  itemFilter: string;
  searchQuery: string;
  onSearchQuery: (value: string) => void;
  onLocationFilter: (value: "전체" | LocationGroup) => void;
  onItemFilter: (value: string) => void;
  onCustomItem: () => void;
  onDetail: (id: number) => void;
}) {
  const [sort, setSort] = useState<"최신순" | "가까운 날짜순">("최신순");

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-20 bg-white/95 px-5 pb-4 pt-5 backdrop-blur">
        <h1 className="text-[24px] font-bold tracking-[-0.04em]">검색</h1>
        <div className="mt-4 flex h-[52px] items-center gap-3 rounded-[18px] bg-[#f4f5f7] px-4">
          <Search size={18} className="text-[#777c85]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQuery(event.target.value)}
            placeholder="에어팟, 명신관, 토끼 키링..."
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#9ba0a8]"
          />
          {searchQuery && <button type="button" onClick={() => onSearchQuery("")} className="grid size-7 place-items-center rounded-full bg-[#e7e9ec]"><X size={14} /></button>}
        </div>

        <div className="mt-4 flex gap-2">
          {(["전체", "학교", "학교 외"] as const).map((item) => <FilterChip key={item} label={item} active={locationFilter === item} onClick={() => onLocationFilter(item)} />)}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip label="전체 물건" active={itemFilter === "전체"} onClick={() => onItemFilter("전체")} />
          {itemTypes.map((item) => <FilterChip key={item} label={item} active={itemFilter === item} onClick={() => onItemFilter(item)} />)}
          <button type="button" onClick={onCustomItem} className="shrink-0 rounded-full bg-[#f4f5f7] px-3.5 py-2 text-[12px] font-semibold text-[#525761] active:scale-95">+ 직접 추가</button>
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center justify-between py-3">
          <p className="text-[13px] font-semibold text-[#686d76]">검색 결과 {posts.length}개</p>
          <button type="button" onClick={() => setSort(sort === "최신순" ? "가까운 날짜순" : "최신순")} className="flex items-center gap-1 text-[12px] font-semibold text-[#777c85]">
            {sort} <ChevronRight size={14} className="rotate-90" />
          </button>
        </div>
        <div className="space-y-3">
          {posts.map((post) => <PostCard key={post.id} post={post} onClick={() => onDetail(post.id)} />)}
          {posts.length === 0 && <EmptyState title="검색 결과가 없어요" body="위치나 물건 필터를 조금 넓혀보세요." />}
        </div>
      </div>
    </div>
  );
}

function CreateScreen({
  initialType,
  itemTypes,
  onAddItemType,
  onClose,
  onSubmit,
}: {
  initialType: PostType;
  itemTypes: string[];
  onAddItemType: (value: string) => void;
  onClose: () => void;
  onSubmit: (post: Omit<Post, "id" | "owner" | "createdLabel" | "verified">) => void;
}) {
  const [type, setType] = useState<PostType>(initialType);
  const [itemType, setItemType] = useState(itemTypes[0] ?? "기타");
  const [customType, setCustomType] = useState("");
  const [showCustomType, setShowCustomType] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-09-22");
  const [time, setTime] = useState("13:30");
  const [locationGroup, setLocationGroup] = useState<LocationGroup>("학교");
  const [location, setLocation] = useState(SCHOOL_LOCATIONS[0]);
  const [detailLocation, setDetailLocation] = useState("");
  const [description, setDescription] = useState("");
  const [featureTags, setFeatureTags] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [storageType, setStorageType] = useState<StorageType>("left");
  const [storageDetail, setStorageDetail] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const locationOptions = locationGroup === "학교" ? SCHOOL_LOCATIONS : OUTSIDE_LOCATIONS;
  const foundGuide = PHOTO_GUIDES[itemType] ?? "전체 형태와 색상, 구별 가능한 특징이 보이도록 찍어주세요. 개인정보는 노출하지 마세요.";
  const lostGuide = "지금 물건이 없어도 괜찮아요. 예전에 찍어둔 사진, 같은 모델의 참고 사진, 물건을 알아볼 수 있는 사진이 있다면 선택적으로 추가해 주세요.";

  function changeLocationGroup(next: LocationGroup) {
    setLocationGroup(next);
    setLocation(next === "학교" ? SCHOOL_LOCATIONS[0] : OUTSIDE_LOCATIONS[0]);
  }

  function addFeatureTag() {
    const value = featureInput.trim();
    if (!value) return;
    if (!featureTags.includes(value)) setFeatureTags((prev) => [...prev, value]);
    setFeatureInput("");
  }

  function addCustomType() {
    const value = customType.trim();
    if (!value) return;
    onAddItemType(value);
    setItemType(value);
    setCustomType("");
    setShowCustomType(false);
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = Math.max(0, 3 - photoUrls.length);
    const next = Array.from(files).slice(0, remaining).map((file) => URL.createObjectURL(file));
    setPhotoUrls((prev) => [...prev, ...next]);
  }

  function submit() {
    if (!title.trim() || !detailLocation.trim() || !description.trim()) return;
    onSubmit({
      type,
      itemType,
      title: title.trim(),
      locationGroup,
      location,
      detailLocation: detailLocation.trim(),
      date,
      time,
      description: description.trim(),
      featureTags,
      storageType: type === "found" ? storageType : undefined,
      storageDetail: type === "found" ? storageDetail.trim() : undefined,
    });
  }

  const canSubmit = title.trim() && detailLocation.trim() && description.trim() && (type === "lost" || storageDetail.trim() || storageType === "keeping");

  return (
    <div className="min-h-screen bg-white pb-28">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/95 px-5 backdrop-blur">
        <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-[#f4f5f7] active:scale-95"><X size={19} /></button>
        <p className="text-[15px] font-bold">분실물 등록</p>
        <div className="w-10" />
      </header>

      <div className="px-5">
        <section className="pt-3">
          <p className="text-[12px] font-bold text-[#8b9098]">등록 유형</p>
          <div className="mt-3 grid grid-cols-2 rounded-[20px] bg-[#f3f4f6] p-1.5">
            <button type="button" onClick={() => setType("lost")} className={cn("h-12 rounded-[15px] text-[14px] font-bold transition", type === "lost" ? "bg-white text-[#315fd6] shadow-sm" : "text-[#7e838c]")}>분실했어요</button>
            <button type="button" onClick={() => setType("found")} className={cn("h-12 rounded-[15px] text-[14px] font-bold transition", type === "found" ? "bg-white text-[#26825a] shadow-sm" : "text-[#7e838c]")}>주웠어요</button>
          </div>
          <p className="mt-3 text-[13px] leading-5 text-[#777c85]">
            {type === "lost" ? "잃어버린 물건의 마지막 위치와 특징을 최대한 구체적으로 적어주세요." : "발견 위치와 현재 물건이 어디에 있는지 함께 알려주세요."}
          </p>
        </section>

        <FormSection title="어떤 물건인가요?" description="자주 잃어버리는 물건을 먼저 보여드려요.">
          <div className="flex flex-wrap gap-2">
            {itemTypes.map((item) => <ChoiceChip key={item} label={item} active={itemType === item} onClick={() => setItemType(item)} />)}
            <button type="button" onClick={() => setShowCustomType(true)} className="rounded-full bg-[#f4f5f7] px-3.5 py-2.5 text-[12px] font-semibold text-[#565b64] active:scale-95">+ 직접 추가</button>
          </div>
          {showCustomType && (
            <div className="mt-3 flex gap-2 rounded-[18px] bg-[#f5f6f8] p-2">
              <input value={customType} onChange={(event) => setCustomType(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addCustomType()} placeholder="예: 안경" className="min-w-0 flex-1 bg-transparent px-2 text-[14px] outline-none" />
              <button type="button" onClick={addCustomType} className="rounded-[13px] bg-[#17181c] px-4 text-[12px] font-bold text-white">추가</button>
            </div>
          )}
          <TextField label="게시글 제목" value={title} onChange={setTitle} placeholder={type === "lost" ? "예: 에어팟 프로 2세대 찾습니다" : "예: 검정색 장우산 주웠어요"} />
        </FormSection>

        <FormSection title={type === "lost" ? "언제 잃어버렸나요?" : "언제 발견했나요?"} description="정확하지 않아도 가장 가까운 시간으로 적어주세요.">
          <div className="grid grid-cols-[1.2fr_.8fr] gap-2">
            <label className="rounded-[18px] bg-[#f5f6f8] px-4 py-3">
              <span className="block text-[11px] font-semibold text-[#8c9199]">날짜</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full bg-transparent text-[14px] font-semibold outline-none" />
            </label>
            <label className="rounded-[18px] bg-[#f5f6f8] px-4 py-3">
              <span className="block text-[11px] font-semibold text-[#8c9199]">시간</span>
              <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-1 w-full bg-transparent text-[14px] font-semibold outline-none" />
            </label>
          </div>
        </FormSection>

        <FormSection title={type === "lost" ? "마지막으로 본 곳은 어디인가요?" : "어디에서 발견했나요?"} description="학교 안인지 밖인지 먼저 선택해 주세요.">
          <div className="flex gap-2">
            <ChoiceChip label="학교" active={locationGroup === "학교"} onClick={() => changeLocationGroup("학교")} />
            <ChoiceChip label="학교 외" active={locationGroup === "학교 외"} onClick={() => changeLocationGroup("학교 외")} />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {locationOptions.map((item) => <ChoiceChip key={item} label={item} active={location === item} onClick={() => setLocation(item)} />)}
          </div>
          <TextField label="상세 위치" value={detailLocation} onChange={setDetailLocation} placeholder={locationGroup === "학교" ? "예: 3층 308호 앞 복도" : "예: 10번 출구 계단 아래"} />
        </FormSection>

        <FormSection title="어떤 특징이 있나요?" description="주인이 알아볼 수 있는 특징은 구체적일수록 좋아요.">
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="색상, 케이스, 키링, 흠집, 마지막 사용 상황 등을 적어주세요." className="min-h-32 w-full resize-none rounded-[20px] bg-[#f5f6f8] p-4 text-[14px] leading-6 outline-none placeholder:text-[#a1a5ad]" />
          <div className="mt-3 rounded-[18px] bg-[#f5f6f8] p-2">
            <div className="flex gap-2">
              <input value={featureInput} onChange={(event) => setFeatureInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addFeatureTag()} placeholder="특징 태그 직접 추가 · 예: 토끼 키링" className="min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none" />
              <button type="button" onClick={addFeatureTag} className="grid size-9 place-items-center rounded-[12px] bg-white shadow-sm"><Plus size={17} /></button>
            </div>
            {featureTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 px-1 pb-1">
                {featureTags.map((tag) => (
                  <button key={tag} type="button" onClick={() => setFeatureTags((prev) => prev.filter((item) => item !== tag))} className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-[#555a63] shadow-sm">#{tag}<X size={12} /></button>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        <FormSection
          title={type === "lost" ? "사진이 있다면 추가해 주세요" : "사진을 추가해 주세요"}
          description={type === "lost" ? "분실한 경우 사진은 선택 사항이에요." : "습득물은 사진이 있으면 주인이 훨씬 빠르게 확인할 수 있어요."}
        >
          <div className={cn("rounded-[22px] p-4", type === "found" ? "bg-[#f0f7f3]" : "bg-[#f3f5fa]")}> 
            <div className="flex gap-3">
              <div className={cn("grid size-10 shrink-0 place-items-center rounded-full bg-white", type === "found" ? "text-[#26825a]" : "text-[#315fd6]")}><Camera size={18} /></div>
              <div>
                <p className="text-[12px] font-bold">{type === "found" ? `${itemType} 촬영 가이드` : "분실 사진 안내"}</p>
                <p className="mt-1 text-[12px] leading-5 text-[#666c76]">{type === "found" ? foundGuide : lostGuide}</p>
              </div>
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleFiles(event.target.files)} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {photoUrls.map((url, index) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-[20px] bg-[#f1f2f4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`선택 사진 ${index + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => setPhotoUrls((prev) => prev.filter((_, i) => i !== index))} className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/65 text-white"><X size={13} /></button>
              </div>
            ))}
            {photoUrls.length < 3 && (
              <button type="button" onClick={() => fileRef.current?.click()} className="flex aspect-square flex-col items-center justify-center rounded-[20px] bg-[#f5f6f8] text-[#777c85] active:scale-[0.98]">
                <ImagePlus size={21} />
                <span className="mt-2 text-[11px] font-semibold">사진 추가</span>
                <span className="mt-0.5 text-[10px] text-[#a2a6ad]">{photoUrls.length}/3</span>
              </button>
            )}
          </div>
        </FormSection>

        {type === "found" && (
          <FormSection title="지금 물건은 어디에 있나요?" description="가져오지 않고 그 자리에 둔 경우도 꼭 알려주세요.">
            <div className="space-y-2">
              <StorageOption active={storageType === "left"} title="그 자리에 그냥 뒀어요" description="발견한 위치에 그대로 두고 이동했어요." onClick={() => setStorageType("left")} />
              <StorageOption active={storageType === "keeping"} title="제가 보관하고 있어요" description="연락이 오면 직접 전달할 수 있어요." onClick={() => setStorageType("keeping")} />
              <StorageOption active={storageType === "school"} title="학교 시설에 맡겼어요" description="안내데스크, 경비실, 학생지원센터 등에 맡겼어요." onClick={() => setStorageType("school")} />
              <StorageOption active={storageType === "police"} title="경찰서·지구대 등에 맡겼어요" description="지구대, 경찰서, 역무실 등 공식 보관 장소에 맡겼어요." onClick={() => setStorageType("police")} />
            </div>

            {storageType !== "keeping" && (
              <TextField
                label={storageType === "left" ? "그대로 둔 정확한 위치" : "맡긴 장소"}
                value={storageDetail}
                onChange={setStorageDetail}
                placeholder={storageType === "left" ? "예: 학생회관 2층 소파 옆 테이블" : storageType === "school" ? "예: 도서관 1층 안내데스크" : "예: 숙대입구역 역무실"}
              />
            )}

            {storageType === "keeping" && (
              <div className="mt-3 rounded-[18px] bg-[#f5f6f8] px-4 py-3 text-[12px] leading-5 text-[#656b75]">개인 연락처는 공개되지 않아요. 게시글의 1:1 채팅으로 전달 시간을 조율할 수 있습니다.</div>
            )}

            <div className="mt-3 rounded-[22px] bg-[#f7f8fa] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#4f5661]"><MapPin size={16} /><p className="text-[12px] font-bold">주변 보관 장소 추천</p></div>
                  <p className="mt-2 text-[13px] font-semibold">{locationGroup === "학교" ? "학생지원센터 분실물 보관함" : "가까운 지구대 또는 역무실"}</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#838892]">현재 선택한 위치를 기준으로 추천한 예시입니다. 실제 API 연결 시 거리순으로 표시됩니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (locationGroup === "학교") {
                      setStorageType("school");
                      setStorageDetail("학생지원센터 분실물 보관함");
                    } else {
                      setStorageType("police");
                      setStorageDetail("가까운 지구대 또는 역무실");
                    }
                  }}
                  className="shrink-0 rounded-full bg-white px-3 py-2 text-[11px] font-bold shadow-sm active:scale-95"
                >선택</button>
              </div>
            </div>
          </FormSection>
        )}

        <div className="mb-4 mt-8 rounded-[22px] bg-[#f5f6f8] p-4">
          <div className="flex gap-3">
            <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#686e78]" />
            <p className="text-[12px] leading-5 text-[#686e78]">학생증·카드 등 개인정보가 있는 물건은 사진과 설명에 이름, 학번, 카드번호를 그대로 올리지 마세요. 소유 확인은 채팅에서 일부 특징을 대조하는 방식이 안전합니다.</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <button type="button" disabled={!canSubmit} onClick={submit} className={cn("h-14 w-full rounded-[18px] text-[15px] font-bold transition active:scale-[0.99]", canSubmit ? "bg-[#17181c] text-white" : "bg-[#eceef1] text-[#a3a7ae]")}>게시글 등록하기</button>
      </div>
    </div>
  );
}

function DetailScreen({ post, onBack, onChat, onShare, onComplete }: { post: Post; onBack: () => void; onChat: () => void; onShare: () => void; onComplete: () => void }) {
  return (
    <div className="min-h-screen bg-white pb-28">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/95 px-5 backdrop-blur">
        <button type="button" onClick={onBack} className="grid size-10 place-items-center rounded-full bg-[#f4f5f7] active:scale-95"><ArrowLeft size={19} /></button>
        <div className="flex gap-2">
          <button type="button" onClick={onShare} className="grid size-10 place-items-center rounded-full bg-[#f4f5f7] active:scale-95"><Share2 size={18} /></button>
          <button type="button" className="grid size-10 place-items-center rounded-full bg-[#f4f5f7] active:scale-95"><MoreHorizontal size={19} /></button>
        </div>
      </header>

      <div className="px-5 pt-3">
        <div className="flex items-center gap-2">
          <StatusPill type={post.type} />
          <span className="text-[12px] font-semibold text-[#8f949d]">{post.createdLabel}</span>
        </div>
        <h1 className="mt-4 text-[26px] font-bold leading-[1.25] tracking-[-0.045em]">{post.title}</h1>
        <div className="mt-4 flex items-center gap-2 text-[12px] text-[#727780]">
          <CircleUserRound size={17} />
          <span className="font-semibold text-[#4c5159]">{post.owner}</span>
          {post.verified && <span className="rounded-full bg-[#eef5ff] px-2 py-1 text-[10px] font-bold text-[#315fd6]">재학생 인증</span>}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2">
          <InfoTile icon={<MapPin size={17} />} label={post.type === "lost" ? "마지막 위치" : "발견 위치"} value={`${post.location} · ${post.detailLocation}`} />
          <InfoTile icon={<Clock3 size={17} />} label={post.type === "lost" ? "분실 시점" : "발견 시점"} value={`${post.date}\n${post.time}`} />
        </div>

        {post.type === "found" && post.storageType && (
          <div className="mt-3 rounded-[22px] bg-[#f1f7f3] p-4">
            <div className="flex items-center gap-2 text-[#26825a]"><Check size={16} /><p className="text-[12px] font-bold">현재 보관 상태</p></div>
            <p className="mt-2 text-[15px] font-bold">{storageLabel(post.storageType)}</p>
            {post.storageDetail && <p className="mt-1 text-[13px] leading-5 text-[#626a66]">{post.storageDetail}</p>}
          </div>
        )}

        <section className="mt-8">
          <p className="text-[13px] font-bold text-[#777c85]">상세 특징</p>
          <p className="mt-3 text-[15px] leading-7 text-[#33373e]">{post.description}</p>
          {post.featureTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.featureTags.map((tag) => <span key={tag} className="rounded-full bg-[#f4f5f7] px-3 py-2 text-[11px] font-semibold text-[#5e636c]">#{tag}</span>)}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[24px] bg-[#f7f8fa] p-5">
          <p className="text-[12px] font-bold text-[#858a93]">비슷한 게시글을 찾는 기준</p>
          <p className="mt-2 text-[14px] font-semibold">{post.itemType} · {post.locationGroup} · {post.location}</p>
          <p className="mt-2 text-[12px] leading-5 text-[#7c818a]">향후 API를 연결하면 날짜·거리·태그 유사도를 조합해 관련 분실/습득물을 추천할 수 있습니다.</p>
        </section>

        {post.owner === "나" && (
          <button type="button" onClick={onComplete} className="mt-4 h-12 w-full rounded-[16px] bg-[#f4f5f7] text-[13px] font-bold text-[#5d626b] active:scale-[0.99]">물건을 찾았어요 · 완료 처리</button>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <button type="button" onClick={onChat} className="flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#17181c] text-[15px] font-bold text-white active:scale-[0.99]"><MessageCircle size={18} /> 작성자와 채팅하기</button>
      </div>
    </div>
  );
}

function ChatListScreen({ conversations, posts, onOpen }: { conversations: Conversation[]; posts: Post[]; onOpen: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const filtered = conversations.filter((conversation) => {
    const post = posts.find((item) => item.id === conversation.postId);
    const q = query.trim().toLowerCase();
    return !q || conversation.name.toLowerCase().includes(q) || post?.title.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pb-3 pt-5">
        <h1 className="text-[24px] font-bold tracking-[-0.04em]">채팅</h1>
        <div className="mt-4 flex h-[52px] items-center gap-3 rounded-[18px] bg-[#f4f5f7] px-4">
          <Search size={18} className="text-[#7b8088]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름 또는 물건으로 검색" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#9ca0a8]" />
        </div>
      </div>

      <div className="px-5">
        {filtered.map((conversation) => {
          const post = posts.find((item) => item.id === conversation.postId);
          if (!post) return null;
          return (
            <button key={conversation.id} type="button" onClick={() => onOpen(conversation.id)} className="flex w-full items-center gap-3 py-4 text-left active:opacity-65">
              <div className="relative grid size-12 shrink-0 place-items-center rounded-full bg-[#f0f2f5] text-[14px] font-bold text-[#5d626b]">
                {conversation.name.slice(0, 1)}
                {conversation.online && <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-[#43b77a] ring-2 ring-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-bold">{conversation.name}</p>
                  <StatusPill type={post.type} compact />
                </div>
                <p className="mt-1 truncate text-[12px] font-semibold text-[#7d828b]">{post.title}</p>
                <p className="mt-1 truncate text-[13px] text-[#555b64]">{conversation.lastMessage}</p>
              </div>
              <div className="flex h-14 shrink-0 flex-col items-end justify-between py-1">
                <span className="text-[10px] font-semibold text-[#a0a4ab]">{conversation.time}</span>
                {conversation.unread > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-[#17181c] px-1.5 py-1 text-[10px] font-bold text-white">{conversation.unread}</span>}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <EmptyState title="채팅이 없어요" body="게시글 상세에서 작성자에게 메시지를 보내면 이곳에 대화가 모입니다." />}
      </div>
    </div>
  );
}

function ChatRoomScreen({
  conversation,
  post,
  messages,
  onBack,
  onPost,
  onSend,
  onPhoto,
}: {
  conversation: Conversation;
  post: Post;
  messages: ChatMessage[];
  onBack: () => void;
  onPost: () => void;
  onSend: (text: string) => void;
  onPhoto: () => void;
}) {
  const [text, setText] = useState("");

  function send() {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-white/95 px-4 backdrop-blur">
        <button type="button" onClick={onBack} className="grid size-10 place-items-center rounded-full bg-[#f4f5f7] active:scale-95"><ArrowLeft size={19} /></button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><p className="truncate text-[14px] font-bold">{conversation.name}</p>{conversation.online && <span className="text-[10px] font-semibold text-[#2d9669]">접속 중</span>}</div>
          <p className="mt-0.5 truncate text-[11px] text-[#90949c]">게시글을 통해 연결된 1:1 채팅</p>
        </div>
        <button type="button" className="grid size-10 place-items-center rounded-full bg-[#f4f5f7]"><MoreHorizontal size={18} /></button>
      </header>

      <button type="button" onClick={onPost} className="mx-4 mt-3 flex items-center gap-3 rounded-[20px] bg-white p-3 text-left shadow-[0_5px_18px_rgba(17,24,39,0.04)] active:scale-[0.995]">
        <div className={cn("grid size-11 shrink-0 place-items-center rounded-[15px]", post.type === "lost" ? "bg-[#eef3ff] text-[#315fd6]" : "bg-[#eff8f2] text-[#26825a]")}>
          {post.type === "lost" ? <Search size={18} /> : <Sparkles size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-[#979ba3]">연결된 게시글</p>
          <p className="mt-1 truncate text-[13px] font-bold">{post.title}</p>
          <p className="mt-0.5 truncate text-[11px] text-[#7f848d]">{post.location} · {post.detailLocation}</p>
        </div>
        <ChevronRight size={17} className="text-[#999da5]" />
      </button>

      <div className="flex-1 space-y-3 px-4 py-5">
        <div className="mx-auto w-fit rounded-full bg-[#e9ebee] px-3 py-1.5 text-[10px] font-semibold text-[#7f848c]">오늘</div>
        {messages.length === 0 && <p className="pt-10 text-center text-[12px] leading-5 text-[#969aa2]">게시글의 특징을 먼저 확인한 뒤<br />안전하게 대화를 시작해 보세요.</p>}
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.mine ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[78%] rounded-[20px] px-4 py-3", message.mine ? "rounded-br-[7px] bg-[#17181c] text-white" : "rounded-bl-[7px] bg-white text-[#31353c] shadow-[0_3px_12px_rgba(17,24,39,0.04)]")}>
              <p className="text-[13px] leading-5">{message.text}</p>
              <p className={cn("mt-1 text-right text-[9px]", message.mine ? "text-white/55" : "text-[#a0a4ab]")}>{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white px-4 pb-4 pt-3">
        <div className="flex items-end gap-2 rounded-[22px] bg-[#f3f4f6] p-2">
          <button type="button" onClick={onPhoto} className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm active:scale-95"><ImagePlus size={18} /></button>
          <textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="메시지 보내기" rows={1} className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-[13px] outline-none placeholder:text-[#a0a4ac]" />
          <button type="button" onClick={send} disabled={!text.trim()} className={cn("grid size-10 shrink-0 place-items-center rounded-full transition", text.trim() ? "bg-[#17181c] text-white" : "bg-[#e5e7ea] text-[#a2a6ad]")}><Send size={17} /></button>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ posts, onDetail, onPoints, onNotice }: { posts: Post[]; onDetail: (id: number) => void; onPoints: () => void; onNotice: () => void }) {
  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold tracking-[-0.04em]">마이</h1>
          <span className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-[11px] font-bold text-[#315fd6]">재학생 인증</span>
        </div>

        <div className="mt-5 rounded-[26px] bg-[#17181c] p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-white/55">도움의 손 · Lv.2</p>
              <p className="mt-2 text-[28px] font-bold tracking-[-0.04em]">1,240 P</p>
            </div>
            <div className="grid size-12 place-items-center rounded-full bg-white/10"><Trophy size={22} /></div>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[62%] rounded-full bg-white" /></div>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-white/45"><span>다음 뱃지까지 760P</span><span>2,000P</span></div>
          <button type="button" onClick={onPoints} className="mt-5 h-11 w-full rounded-[14px] bg-white text-[12px] font-bold text-[#17181c] active:scale-[0.99]">포인트 사용하기</button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <MiniStat value="6" label="등록" />
          <MiniStat value="3" label="반환 완료" />
          <MiniStat value="4" label="보유 뱃지" />
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between"><h2 className="text-[16px] font-bold">내 게시글</h2><span className="text-[11px] font-semibold text-[#969aa2]">{posts.length}개</span></div>
          <div className="mt-3 space-y-2">
            {posts.map((post) => <PostCard key={post.id} post={post} onClick={() => onDetail(post.id)} compact />)}
            {posts.length === 0 && <div className="rounded-[22px] bg-[#f5f6f8] p-5 text-[13px] leading-5 text-[#80858e]">아직 직접 등록한 게시글이 없어요. 홈에서 분실 또는 습득 글을 작성해 보세요.</div>}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-[16px] font-bold">설정</h2>
          <div className="mt-2">
            <SettingsRow label="분실물 알림" value="켜짐" onClick={onNotice} />
            <SettingsRow label="학교 이메일 인증" value="완료" />
            <SettingsRow label="이용 가이드" />
          </div>
        </section>
      </div>
    </div>
  );
}

function BottomNav({ screen, onNavigate, onCreate }: { screen: Screen; onNavigate: (screen: MainScreen) => void; onCreate: () => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 grid h-[78px] w-full max-w-[430px] -translate-x-1/2 grid-cols-5 bg-white/96 px-3 pb-2 pt-2 backdrop-blur-xl shadow-[0_-8px_24px_rgba(17,24,39,0.04)]">
      <NavItem active={screen === "home"} icon={<Home size={20} />} label="홈" onClick={() => onNavigate("home")} />
      <NavItem active={screen === "search"} icon={<Search size={20} />} label="검색" onClick={() => onNavigate("search")} />
      <button type="button" onClick={onCreate} className="mx-auto -mt-5 grid size-14 place-items-center rounded-full bg-[#17181c] text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)] active:scale-95"><Plus size={24} /></button>
      <NavItem active={screen === "chats"} icon={<MessageCircle size={20} />} label="채팅" onClick={() => onNavigate("chats")} />
      <NavItem active={screen === "profile"} icon={<CircleUserRound size={20} />} label="마이" onClick={() => onNavigate("profile")} />
    </nav>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex flex-col items-center justify-center gap-1 text-[10px] font-semibold active:scale-95", active ? "text-[#17181c]" : "text-[#9b9fa7]")}>
      {icon}<span>{label}</span>
    </button>
  );
}

function PostCard({ post, onClick, compact = false }: { post: Post; onClick: () => void; compact?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={cn("w-full rounded-[24px] bg-[#f7f8fa] text-left active:scale-[0.99]", compact ? "p-3.5" : "p-4")}>
      <div className="flex items-start gap-3">
        <div className={cn("grid shrink-0 place-items-center rounded-[18px]", compact ? "size-12" : "size-14", post.type === "lost" ? "bg-[#eaf0ff] text-[#315fd6]" : "bg-[#e9f6ee] text-[#26825a]")}>
          {post.type === "lost" ? <Search size={20} /> : <Sparkles size={20} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><StatusPill type={post.type} compact /><span className="text-[10px] font-semibold text-[#a0a4ab]">{post.createdLabel}</span></div>
          <h3 className="mt-2 truncate text-[15px] font-bold tracking-[-0.02em]">{post.title}</h3>
          <p className="mt-1 truncate text-[12px] text-[#737881]">{post.location} · {post.detailLocation}</p>
          {!compact && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#666b74]">{post.itemType}</span>
              {post.featureTags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#777c84]">#{tag}</span>)}
            </div>
          )}
        </div>
        <ChevronRight size={17} className="mt-1 shrink-0 text-[#a2a6ad]" />
      </div>
    </button>
  );
}

function StatusPill({ type, compact = false }: { type: PostType; compact?: boolean }) {
  return <span className={cn("rounded-full font-bold", compact ? "px-2 py-1 text-[9px]" : "px-2.5 py-1.5 text-[10px]", type === "lost" ? "bg-[#eaf0ff] text-[#315fd6]" : "bg-[#eaf7ef] text-[#26825a]")}>{type === "lost" ? "분실" : "습득"}</span>;
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition active:scale-95", active ? "bg-[#17181c] text-white" : "bg-[#f4f5f7] text-[#666b74]")}>{label}</button>;
}

function ChoiceChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("shrink-0 rounded-full px-3.5 py-2.5 text-[12px] font-semibold transition active:scale-95", active ? "bg-[#17181c] text-white" : "bg-[#f4f5f7] text-[#636872]")}>{label}</button>;
}

function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="text-[18px] font-bold tracking-[-0.03em]">{title}</h2>
      {description && <p className="mt-1 text-[12px] leading-5 text-[#858a93]">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="mt-3 block rounded-[18px] bg-[#f5f6f8] px-4 py-3">
      <span className="block text-[11px] font-semibold text-[#8d929a]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1.5 w-full bg-transparent text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-[#a1a5ad]" />
    </label>
  );
}

function StorageOption({ active, title, description, onClick }: { active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-[20px] p-4 text-left active:scale-[0.995]", active ? "bg-[#edf3ef]" : "bg-[#f5f6f8]")}>
      <div className={cn("grid size-8 shrink-0 place-items-center rounded-full", active ? "bg-[#26825a] text-white" : "bg-white text-transparent shadow-sm")}><Check size={15} /></div>
      <div><p className="text-[13px] font-bold">{title}</p><p className="mt-1 text-[11px] leading-4 text-[#838892]">{description}</p></div>
    </button>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[#f5f6f8] p-4">
      <div className="flex items-center gap-2 text-[#747982]">{icon}<span className="text-[11px] font-bold">{label}</span></div>
      <p className="mt-3 whitespace-pre-line text-[13px] font-semibold leading-5 text-[#353940]">{value}</p>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-[24px] bg-[#f6f7f9] px-5 py-10 text-center"><p className="text-[14px] font-bold">{title}</p><p className="mx-auto mt-2 max-w-[240px] text-[12px] leading-5 text-[#8b9098]">{body}</p></div>;
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-[20px] bg-[#f5f6f8] p-4 text-center"><p className="text-[18px] font-bold">{value}</p><p className="mt-1 text-[10px] font-semibold text-[#8d929a]">{label}</p></div>;
}

function SettingsRow({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="flex w-full items-center justify-between py-4 text-left active:opacity-60"><span className="text-[13px] font-semibold">{label}</span><div className="flex items-center gap-2"><span className="text-[11px] font-semibold text-[#9498a0]">{value}</span><ChevronRight size={16} className="text-[#a2a6ad]" /></div></button>;
}

function NoticeItem({ title, body, time }: { title: string; body: string; time: string }) {
  return <div className="rounded-[20px] bg-[#f5f6f8] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[13px] font-bold">{title}</p><p className="mt-1 text-[12px] leading-5 text-[#737881]">{body}</p></div><span className="shrink-0 text-[10px] font-semibold text-[#9da1a9]">{time}</span></div></div>;
}

function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/35 px-0" onMouseDown={onClose}>
      <div className="w-full max-w-[430px] rounded-t-[30px] bg-white p-5 pb-7 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#d8dbe0]" />
        <div className="mb-5 mt-4 flex items-center justify-between"><h3 className="text-[18px] font-bold tracking-[-0.03em]">{title}</h3><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[#f4f5f7]"><X size={17} /></button></div>
        {children}
      </div>
    </div>
  );
}

function SimpleModal({ title, description, value, placeholder, onChange, onClose, onSubmit, submitLabel }: { title: string; description: string; value: string; placeholder: string; onChange: (value: string) => void; onClose: () => void; onSubmit: () => void; submitLabel: string }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/35 px-5" onMouseDown={onClose}>
      <div className="w-full max-w-[390px] rounded-[28px] bg-white p-5 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><h3 className="text-[18px] font-bold">{title}</h3><p className="mt-2 text-[12px] leading-5 text-[#7f848d]">{description}</p></div><button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f4f5f7]"><X size={17} /></button></div>
        <input autoFocus value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onSubmit()} placeholder={placeholder} className="mt-5 h-[52px] w-full rounded-[17px] bg-[#f4f5f7] px-4 text-[14px] outline-none placeholder:text-[#a0a4ac]" />
        <button type="button" onClick={onSubmit} className="mt-3 h-[52px] w-full rounded-[17px] bg-[#17181c] text-[14px] font-bold text-white active:scale-[0.99]">{submitLabel}</button>
      </div>
    </div>
  );
}
