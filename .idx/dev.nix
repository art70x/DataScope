# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  channel = "stable-25.05";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs
    pkgs.pnpm
  ];
}
