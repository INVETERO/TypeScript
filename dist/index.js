"use strict";
let userProfile = {
    name: "Guest",
    age: 25,
    active: true,
};
const formatUser = (profile) => `User: ${profile.name} | Age: ${profile.age} | Active: ${profile.active}`;
const renderToDom = (profile) => {
    if (typeof document === "undefined") {
        return;
    }
    const nameNode = document.querySelector("[data-user-name]");
    const ageNode = document.querySelector("[data-user-age]");
    const statusNode = document.querySelector("[data-user-status]");
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
const updateProfile = (profile) => {
    const summary = formatUser(profile);
    console.log(summary);
    renderToDom(profile);
};
const wireUi = () => {
    if (typeof document === "undefined") {
        return;
    }
    const toggleButton = document.querySelector("[data-toggle-status]");
    if (!toggleButton) {
        return;
    }
    toggleButton.addEventListener("click", () => {
        userProfile = Object.assign(Object.assign({}, userProfile), { active: !userProfile.active });
        updateProfile(userProfile);
    });
};
updateProfile(userProfile);
wireUi();
