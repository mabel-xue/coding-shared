# Shell

- [学习地址](https://classroom.udacity.com/courses/ud206)

## echo & ls & cd

## pwd

```pwd``` 获取当前所在位置的绝对路径(Print Working Directory);

## ls -l

```ls -l Documents/``` 列出 Documents 目录下的文件信息;
```ls -l Documents/*.pdf```

## mkdir & mv

```mkdir Documents/Books``` 在 Documents 目录下新建 Books 文件夹;
```mv Documents/*.pdf Documents/Books``` 将 Documents 目录下所有 pdf 文件移至 Books 目录;

## curl

```curl -o dictionary.txt -L 'http://t.cn/RYkeaZi'```  获取 <http://t.cn/RYkeaZi> 的源码到 dictionary.txt 文件

> 很多 URL 中都有特殊字符，例如 & 符号，它在 shell 中有特殊的含义。因此最好将这些 URL 放在引号内

## cat & less

```cat dictionary.txt``` 查看 dictionary.txt 文件内容;
```less dictionary.txt``` 查看一屏 dictionary.txt 文件内容，```/good``` 翻至'good'处，```q``` 退出;

## rm & rmdir

```rm *.txt``` 清除所有 txt 文件;
```rm -i Sensitive.txt``` 删除 Sensitive.txt 文件至回收箱;
```rmdir Sensitive``` 清除 Sensitive 文件夹;

## grep & wc

```grep shell dictionary.txt``` 获取 dictionary.txt 中有符合规律 shell 的所有内容
```grep shell dictionary.txt | less```

```bash
curl -L 'http://t.cn/RYkeaZi' | grep fish | wc -l
= curl -L 'http://t.cn/RYkeaZi' | grep -c fish
```

获取 <http://t.cn/RYkeaZi> 中有符合规律 fish 的计总

## shell变量 & 环境变量

shell变量 - $LINES $COLUMNS ……
环境变量 - $PATH $PWD $LOGNAME ……

## 起始文件 (.bash_profile)

在 .bash_profile 文件中编辑的内容会在终端打开时执行；

## 控制 shell 提示符 ($PS1)

```PS1='$ '``` 设置 shell 提示符

> [用来构建长而复杂的 $PS1 提示符的工具](http://bashrcgenerator.com)

## alias

```alias ll='ls -la'```
```alias``` 查看所有别名

> 可以将常用别名放在 .bash_profile 文件中
