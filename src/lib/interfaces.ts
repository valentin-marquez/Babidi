export interface Profile {
    id: string;
    fullName: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    status: STATUS;
    accepted_terms: boolean;
    is_adult: boolean;
    geometry: {
        latitude: number;
        longitude: number;
    };
    token: string;
};

export interface UserLocation {
    id: string;
    latitude: number;
    longitude: number;
}

export type STATUS = 'ONLINE' | 'OFFLINE' | 'INVISIBLE';