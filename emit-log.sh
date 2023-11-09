#!/usr/bin/env bash

# 取出 log.txt 的文件内容
log=$(cat log.txt|grep 'New tag:')

# 将换行符替换为两个换行符
log=$(echo "$log")

# 如果 log.txt 为空
if [ -z "$log" ]; then
  curl "https://oapi.dingtalk.com/robot/send?access_token=${DING_TOKEN}" \
   -H 'Content-Type: application/json' \
   -d '{"msgtype": "markdown","markdown": {"title":"orca-fe 发布通知","text":"### @orca-fe/pocket\n\n流水线结束，没有新的模块发布"}}'
  exit 0
fi

# 如果 log.txt 不为空，则将 log 作为消息发出去，需要将 log 的换行符替换为 \n\n
log=$(echo "$log"|sed 's/\n/\\n\\n/g')
curl "https://oapi.dingtalk.com/robot/send?access_token=${DING_TOKEN}" \
   -H 'Content-Type: application/json' \
   -d '{"msgtype": "markdown","markdown": {"title":"orca-fe 发布通知","text":"### @orca-fe/pocket\n\n流水线结束，以下模块已发布：\n\n'"$log"'"}}'

