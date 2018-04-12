#!/bin/bash

INSTALL_LOG="/tmp/bb-customerplatform_fe-install.log"

echo "bb-customerplatform_fe - Install at $(date +'%Y-%m-%d %H:%M')" > $INSTALL_LOG

cd /opt/brandbastion/bb-customerplatform_fe
# config
echo "[INFO] Checking config..." >> $INSTALL_LOG
if [ ! -f "deploy/conf/vars.global" ]; then
                mv "deploy/conf/vars-example.global" "deploy/conf/vars.global" >> $INSTALL_LOG
                echo "[INFO] Using config from template, please set config values!" >> $INSTALL_LOG
else
                rm -rf "deploy/conf/vars-example.global" >> $INSTALL_LOG
                echo "[INFO] Using existing config." >> $INSTALL_LOG
fi

#kill existing process
ps aux | grep "node server" | awk '{print $2}' | xargs sudo kill 2> /dev/null || true

# export bash variable
source deploy/conf/vars.global
export $(cut -d= -f1 deploy/conf/vars.global)

/root/.nvm/versions/node/v7.0.0/bin/node ./node_modules/webpack/bin/webpack.js --config ./webpack.production.config.js --progress --profile --colors
 1>$INSTALL_LOG 2>$INSTALL_LOG

/root/.nvm/versions/node/v7.0.0/bin/node server 1>/tmp/bb-customerplatform_fe.log 2>/tmp/bb-customerplatform_fe.log &

echo "Completed at $(date +'%Y-%m-%d %H:%M')" >> $INSTALL_LOG
