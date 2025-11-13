import { User, AuthToken } from "tweeter-shared";
import { AuthService } from "../model.service/AuthService";

export interface AuthView {
    setBusy?(busy: boolean): void;
    showError(message: string): void;
    onLoggedIn(user: User, token: AuthToken, rememberMe: boolean, originalUrl?: string): void;
    onRegistered(user: User, token: AuthToken, rememberMe: boolean): void;
}

export class AuthPresenter {
    private readonly view: AuthView;
    private readonly service: AuthService;

    constructor(view: AuthView, service = new AuthService()) {
        this.view = view;
        this.service = service;
    }

    private async run<T>(op: () => Promise<T>): Promise<T> {
        this.view.setBusy?.(true);
        try {
            return await op();
        } finally {
            this.view.setBusy?.(false);
        }
    }

    public async login(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string
    ): Promise<void> {
        if (!alias || !password) {
            this.view.showError("Please enter both alias and password.");
        return;
        }
        await this.run(async () => {
            const [user, token] = await this.service.login(alias, password);
            this.view.onLoggedIn(user, token, rememberMe, originalUrl);
        });
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ): Promise<void> {
        if (!firstName || !lastName || !alias || !password || !imageFileExtension) {
            this.view.showError("Please complete all fields and select an image.");
            return;
        }
        await this.run(async () => {
            const [user, token] = await this.service.register(
                firstName, lastName, alias, password, imageBytes, imageFileExtension
            );
            this.view.onRegistered(user, token, rememberMe);
        });
    }
}