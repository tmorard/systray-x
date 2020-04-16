enableGnomeExtension() {
    EXTENSION="ubuntu-appindicator@ubuntu.com"
    PACKAGE="gnome-shell-extension-appindicator"
    ENABLE_CMD="gnome-shell-extension-tool -e ubuntu-appindicator@ubuntu.com"
    #
    #   Is the extension installed?
    #
    if [ -d /usr/share/gnome-shell/extensions/$EXTENSION ] || [ -d ~/.local/share/gnome-shell/extensions/$EXTENSION ] ; then
        $ENABLE_CMD
    else
        echo "Please install: "$PACKAGE
        echo "And run: "$ENABLE_CMD
    fi
}

#
#   Enable the gnome shell extension for the local user
#
if [ "$XDG_CURRENT_DESKTOP" == "ubuntu:GNOME" ] ; then
    enableGnomeExtension
fi