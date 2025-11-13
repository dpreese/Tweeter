import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  setBusy(b: boolean): void;
  showInfo(msg: string, sticky?: boolean): string; // return message id
  dismissMessage(id: string): void;
  showError(msg: string): void;
  clearInput(): void;
}

export class PostStatusPresenter {
  private readonly view: PostStatusView;
  private readonly svc: StatusService;

  constructor(view: PostStatusView, svc = new StatusService()) {
    this.view = view;
    this.svc = svc;
  }

  public async post(text: string, user: User | null, token: AuthToken | null): Promise<void> {
    if (!token || !user) {
      this.view.showError("You must be logged in to post.");
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      this.view.showError("Status cannot be empty.");
      return;
    }

    let msgId = "";
    this.view.setBusy(true);
    try {
      msgId = this.view.showInfo("Posting status...", true);
      const status = new Status(trimmed, user, Date.now());
      await this.svc.postStatus(token, status);
      this.view.clearInput();
      this.view.showInfo("Status posted!", false);
    } catch (e) {
      this.view.showError(`Failed to post the status because of exception: ${e}`);
    } finally {
      if (msgId) this.view.dismissMessage(msgId);
      this.view.setBusy(false);
    }
  }
}
