declare namespace Express {
	// eslint-disable-next-line prefix-types/prefer-interface-prefix
	export interface Request {
		userId?: string;
		userProfile?: {
			id: string;
			name: string;
			bio: string;
			avatar: string | null;
			phoneNumber: string;
			userId: string;
			createdAt: Date;
			updatedAt: Date;
		};
	}
}
