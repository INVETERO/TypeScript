type UserProfile = {
  name: string;
  age: number;
  active: boolean;
};

let userProfile: UserProfile = {
  name: "Guest",
  age: 25,
  active: true,
};

const formatUser = (profile: UserProfile): string =>
  `User: ${profile.name} | Age: ${profile.age} | Active: ${profile.active}`;

const renderToDom = (profile: UserProfile): void => {
  if (typeof document === "undefined") {
    return;
  }

  const nameNode = document.querySelector<HTMLElement>("[data-user-name]");
  const ageNode = document.querySelector<HTMLElement>("[data-user-age]");
  const statusNode = document.querySelector<HTMLElement>("[data-user-status]");

  if (nameNode) {
    nameNode.textContent = profile.name;
  }

  if (ageNode) {
    ageNode.textContent = String(profile.age);
  }

  if (statusNode) {
    statusNode.textContent = profile.active ? "Active" : "Inactive";
    statusNode.classList.toggle("is-active", profile.active);
  }
};

const updateProfile = (profile: UserProfile): void => {
  const summary = formatUser(profile);
  console.log(summary);
  renderToDom(profile);
};

const wireUi = (): void => {
  if (typeof document === "undefined") {
    return;
  }

  const toggleButton = document.querySelector<HTMLButtonElement>(
    "[data-toggle-status]"
  );

  if (!toggleButton) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    userProfile = { ...userProfile, active: !userProfile.active };
    updateProfile(userProfile);
  });
};

updateProfile(userProfile);
wireUi();
