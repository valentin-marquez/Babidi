import React, { useEffect, useState } from "react";
import { getMessages, sendMessage, getUserChats, getUserInfo } from "@lib/chat";
import type { Message, UserInfo } from "@lib/chat";
import type { ReceiverUser } from "@lib/auth";
import { ImagePlus, Info } from "lucide-react";




interface Profile {
    initials: string;
    full_name: string;
    username: string;
    avatar?: string;
}

interface AvatarCardProps {
    profile: Profile;
}

export function AvatarCard({ profile }: AvatarCardProps) {
    const initials = profile.full_name.split(' ').map(name => name[0]).join('');
    return (
        <div className="flex w-full flex-row items-center gap-4">
            <button
                className="btn btn-ghost btn-block flex flex-row justify-start text-start"
                data-astro-prefetch="viewport"
            >
                <div className="avatar placeholder">
                    <div
                        className="w-10 rounded-full bg-primary text-neutral-content "
                    >
                        {
                            profile.avatar ? (
                                <img src={profile.avatar} alt={profile.full_name} />
                            ) : (
                                <span className=" font-sora text-accent-content">{initials}</span>
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-col">
                    <span
                        className="text-sm font-semibold capitalize text-current brightness-150"
                    >
                        {profile.full_name}
                    </span>
                    <span className="text-xs font-semibold lowercase text-neutral">
                        @{profile.username}
                    </span>
                </div>
            </button>
        </div>
    );
}
type MessageListProps = {
    fetchMessages: (userId: string, selectedUser?: ReceiverUser) => void;
    userId: string;
    onUserSelect: (user: ReceiverUser) => void;
};

export function MessageList({ fetchMessages, userId, onUserSelect }: MessageListProps) {
    const [userChats, setUserChats] = useState<UserInfo[]>([]);

    useEffect(() => {
        async function fetchChats() {
            const chatUserIds = await getUserChats(userId);
            const chats = [];
            for (let i = 0; i < chatUserIds.length; i++) {
                const chatUserId = chatUserIds[i];
                const user = await getUserInfo(chatUserId);
                chats.push(user);
            }
            setUserChats(chats);
        }

        fetchChats();
    }, [userId]);

    const handleUserSelection = (user: UserInfo) => {
        onUserSelect(user);
        fetchMessages(userId, user);
    };

    return (
        <aside className="w-72 border-r rounded-3xl border border-base-300 bg-base-200 shadow-sm">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 p-4 border-b border-base-300">
                    <h2 className="p-2 rounded-full  text-lg font-semibold font-syne text-accent-content">Chats</h2>
                </div>

                <div className="overflow-y-auto">
                    <div className="p-4">
                        <div className="space-y-2">
                            {userChats.map((user, index) => (
                                <div key={index} onClick={() => handleUserSelection(user)}>
                                    <AvatarCard profile={{
                                        initials: user.full_name.split(' ').map(name => name[0]).join(''),
                                        full_name: user.full_name,
                                        username: user.username
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

type MessageInputProps = {
    onMessageSent: (userId: string, selectedUser: ReceiverUser) => void;
    fetchMessages: (userId: string, selectedUser: ReceiverUser) => void;
    selectedUser: ReceiverUser;
    userId: string;
};

export function MessageInput({ onMessageSent, fetchMessages, selectedUser, userId }: MessageInputProps): React.ReactElement | null {
    const [newMessage, setNewMessage] = useState("");

    async function handleSendMessage() {
        if (!newMessage.trim()) {
            return;
        }

        await sendMessage(newMessage, userId, selectedUser.user_id);
        setNewMessage("");
        onMessageSent(userId, selectedUser);
        fetchMessages(userId, selectedUser); // Fetch messages after sending a message
    }

    return (
        <div className="flex items-center h-20 p-4 space-x-4 ">
            <button className="btn btn-circle btn-ghost group">
                <ImagePlus className=" group-hover:brightness-200 transition-colors" />
            </button>
            <div className="flex-1">
                <input
                    type="text"
                    className="input input-bordered input-secondary focus:input-primary flex h-10 w-full "
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
            </div>
            <button
                className="btn btn-square btn-primary inline-flex  h-10 px-4 py-2 w-24 btn-sm text-accent-content"
                onClick={handleSendMessage}
            >
                Enviar
            </button>
        </div>
    );
}

type ReceiverInfoProps = {
    user: ReceiverUser;
};

export function ReceiverInfo({ user }: ReceiverInfoProps): React.ReactElement | null {
    return (
        <header className="flex items-center justify-between h-16 p-4 border-b  border-base-300">
            <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                    <div className="bg-primary text-neutral-content rounded-full w-8">
                        {
                            user.avatar ? (
                                <img src={user.avatar} alt={user.full_name} />
                            ) : (
                                <span className="text-xs text-white">
                                    {user.full_name.split(' ').map(name => name[0]).join('')}
                                </span>
                            )
                        }
                    </div>
                </div>
                <div className="grid gap-0.5 text-xs">
                    <div className="font-medium font-sora">
                        <span className="truncate text-accent-content">{user.full_name}</span>
                    </div>
                    <div className="text-gray-400">
                        @{user.username}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="btn btn-circle btn-ghost w-10 h-10 rounded-full">
                    <Info />
                </button>
            </div>
        </header>
    )
}

interface ChatFeedProps {
    messages: Message[];
    userId: string;
}

export function ChatFeed({ messages, userId }: ChatFeedProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
                const date = new Date(Date.parse(message.timestamp));
                const formattedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                return (
                    <div key={index} className={`flex items-end gap-2 justify-${message.sender_id === userId ? 'end' : 'start'}`}>
                        <div className="flex flex-col">
                            <div className={`${message.sender_id === userId ? 'bg-primary text-white' : 'bg-secondary text-white'} rounded-lg p-2`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                            <p className={`text-xs text-accent-content ${message.sender_id === userId ? 'text-right' : 'text-left'}`}>
                                {formattedDate}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function ChatApp({ userId: initialUserId, selectedUser: initialSelectedUser }: { userId: string, selectedUser?: ReceiverUser }) {
    const [userId, setUserId] = useState(initialUserId);
    const [selectedUser, setSelectedUser] = useState<ReceiverUser>(initialSelectedUser);
    const [messages, setMessages] = useState<Message[]>([]);

    async function fetchMessages(userId: string, selectedUser?: ReceiverUser) {
        const messages = await getMessages(userId, selectedUser?.user_id);
        setMessages(messages);
    }

    const handleUserSelect = (user: ReceiverUser) => {
        setSelectedUser(user);
    }

    useEffect(() => {
        console.log("Fetching messages for userId:", userId, "and selectedUser:", selectedUser); // Log userId and selectedUser
        if (selectedUser) {
            fetchMessages(userId, selectedUser.user_id);
        }
    }, [userId, selectedUser]);

    console.log("Rendered with userId:", userId, "selectedUser:", selectedUser); // Log variables on render

    return (
        <div className="!visible transition-opacity duration-150 !opacity-100">
            <main className="flex w-full h-[calc(100vh-68px)] border border-base-300 bg-base-200 shadow-sm">
                <MessageList fetchMessages={fetchMessages} userId={userId} onUserSelect={handleUserSelect} />
                <section className="flex flex-col w-full">
                    {selectedUser && <ReceiverInfo user={selectedUser} />}
                    <ChatFeed messages={messages} userId={userId} />
                    {selectedUser && <MessageInput onMessageSent={fetchMessages} fetchMessages={fetchMessages} selectedUser={selectedUser} userId={userId} />}
                </section>
            </main>
        </div>
    );
}