# Local Disk

> 基于超星云盘 API 和 SQLite 的私有云盘

## 项目信息

- 开发日期：2023 年 3 月 16 日
- 作者主页：https://apee.top
- 项目地址：https://github.com/oyps/local-disk

## 功能特点

- 支持多级文件目录和文件管理，数据保存在本地 SQLite 数据库中
- 无需登录，匿名上传文件到超星云盘，本地只存储文件基本信息

## Docker 部署

```bash
git clone https://github.com/oyps/local-disk.git
docker build -t local-disk-image local-disk
docker run --name local-disk -p 3000:3000 -d local-disk-image
```