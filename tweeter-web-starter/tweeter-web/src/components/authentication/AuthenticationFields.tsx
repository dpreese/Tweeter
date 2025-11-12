import "bootstrap/dist/css/bootstrap.css";
import React from "react";

interface Props {
  mode: "login" | "register";
  originalURL?: string;

  // controlled fields
  alias: string;
  password: string;
  setAlias: (v: string) => void;
  setPassword: (v: string) => void;

  // press Enter handler provided by parent
  onEnter: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const AuthenticationFields: React.FC<Props> = ({
  alias,
  password,
  setAlias,
  setPassword,
  onEnter,
}) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="Alias"
          value={alias}
          onKeyDown={onEnter}
          onChange={(e) => setAlias(e.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          placeholder="Password"
          value={password}
          onKeyDown={onEnter}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
