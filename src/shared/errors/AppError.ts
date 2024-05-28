class AppError {
	constructor(
		public readonly message: string = "An error has occured",
		public readonly status: number = 400,
	) {}
}

export default AppError;
