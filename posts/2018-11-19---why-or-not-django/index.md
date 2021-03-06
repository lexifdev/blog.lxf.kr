---
title: Django를 쓰는 이유, 쓰지 않는 이유
author: lexifdev
date: 2018-11-19
---

# Django를 쓰지 않는 이유

## 1. 정적인 사이트
Django는 동적 사이트를 위한 프레임워크 입니다.

동적 웹사이트는 구동을 위해 [웹 어플리케이션 서버](ways-run-django), [데이터베이스](where-my-data)같은 구성이 필수적입니다.

변화가 거의 없는 사이트에서 매 요청마다 동일한 HTML을 새로 생성하는 것은 비효율 적입니다.
매번 같은 내용의 HTML을 생성할 것이라면 미리 이 내용을 .html 파일로 저장하고 이를 바로 제공하는 것이 효율적일겁니다.  
이렇게 제공하면 구성이 단순한 만큼 속도도 빠르고 비용이 저렴하며 [github.io](https://pages.github.com/)나 [netlify.com](https://www.netlify.com) 처럼 일정 용량 무료로 제공하는 곳들도 있습니다. 

이런 정적인 사이트의 경우 Django 보다는 정적 페이지 생성에 더 최적화 되어있는 프레임워크를 주로 사용합니다. 

이러한 프레임워크로는 [Jekyll](https://jekyllrb.com/)이 가장 널리 사용되고 있고 좀 더 모던한 프레임워크로 [Gatsby](https://www.gatsbyjs.org/)같은게 있습니다.
[이 블로그도 gatsby로 만들어져 있습니다.](https://github.com/lexifdev/blog.lxf.kr)

[Django Distill](https://github.com/mgrp/django-distill) 이라는 확장을 사용해서 Django로 만들어진 동적 사이트에서 정적 페이지를 추출할 수도 있습니다.


## 2. 실시간
웹브라우저에서 채팅과 같은 기능을 구현하기 위해 필요한 기능입니다.

이러한 기술이 널리 퍼지기 전에는 주기적으로 데이터를 확인하는 방법을 사용했습니다.

![주기적으로 확인](01-polling.svg)

주기적으로 확인하는 방법은 주기를 길게 잡으면 반응성이 떨어지고
주기를 짧게 잡으면 부하가 커지는 문제가 있었습니다.

![드문 확인(늦은 메세지 확인)<->잦은 확인(서버 부하 증가)](02-tradeoff-polling.svg)

이후 이런 문제 없이 낮은 서버 부하로 높은 반응성을 구현하기 위해
요청이 오자마자 응답을 보내지 않고 잡고 있다가 이벤트가 발생하면 응답을 보내는 Long-polling, HTTP Streaming 같은 방법이 만들어졌습니다.
그리고 최근에는 이를 위한 전용 기술인 WebSocket 같은 전용 기능이 만들어져 널리 쓰이고 있습니다.

![WebSocket](03-websocket.svg)

Django는 이러한 기술이 인기를 끌기 전에 만들어져 관련된 기능의 지원이 매우 빈약한 편입니다.

Django 에서도 [Channels](https://channels.readthedocs.io/en/latest/) 라는 실시간 기능을 지원하는 API가 추가되었습니다만
처음부터 이를 고려하여 설계된 프레임워크에 비하면 편의성이 떨어집니다.  

이런 실시간 기능을 잘 지원하는 프레임워크로는 [Meteor](https://www.meteor.com/)가 대표적입니다.


## 3. 비동기

### 주문을 완료한 고객에게 이메일을 보내야 합니다. 
이메일을 보내는데 2초의 시간이 걸린다면 사용자는 항상 주문 후 2초간 빈 화면을 보며 기다리게 될겁니다.
하지만 화면을 보여주는데 필수적인 작업이 아니라면 먼저 주문 완료 화면을 보여준 뒤 오래 걸리는 작업은 따로 처리할 수도 있습니다.

![긴 작업 처리의 동기식 vs 비동기식](04-sync-vs-async-long-task.svg)

최근의 웹 프레임워크들이 이러한 백그라운드 작업을 위한 도구를 미리 제공하는데 비해 Django는 이를 기본으로 제공하지 않습니다. 다만 [Celery](http://www.celeryproject.org/)같은 별도의 프로그램을 구성해서 처리할 수 있습니다.


### 한 페이지에서 여러 모델의 값을 읽어서 보여줘야 합니다.
여러개의 Book 모델을 가지고 와야 하는 경우 Django에서는 다음과 같은 코드를 사용할 수 있을겁니다. 
```python
Book.objects.get(id=1)
Book.objects.get(id=2)
Book.objects.get(id=3)
```
첫번째 쿼리가 DBMS에 전달되고 응답이 온 후 두번째 쿼리가 DBMS에 전달되고 다시 두번째 응답이 온 후 세번째 쿼리가 전달되는 방식입니다.
이런 방식에선 전체 실행 시간도 길어져 응답이 늦어질 뿐 아니라 서버의 자원을 낭비하여 더 많은 서버를 필요로 하게 되기도 합니다.

다른 방법으로 여러 쿼리를 모두 보내고 순서에 상관없이 응답을 기다리고 있다가 모든 응답이 도착하면 진행하는 방법도 있습니다.
 
![여러 작업의 동기식 vs 비동기식](05-sync-vs-async-multiple-task.svg)

이러한 방식을 사용하면 사용자에게도 더 빠른 응답을 줄 뿐 아니라 서버를 더 효율적으로 활용할 수 있습니다.

이 또한 Celery를 이용해 비슷한 방식의 구현을 할 수 있지만 언어나 프레임워크 수준에서 지원하는것에 비해 설정이 복잡해지고 오버헤드가 매우 큽니다.


## 4. 페이지 동적 로딩
버튼을 눌렀을때 전체 페이지를 새롭게 불러오는 대신 바뀐 부분만 JavaScript를 이용해 교체한다면 중간에 빈 화면을 보지 않아도 되고 훨씬 빠르게 내용을 확인할 수 있을겁니다.  

![Table without AJAX](table-wo-ajax.gif)
![Table with AJAX](table-with-ajax.gif)

이런 방법을 페이지 내 일부분에만 적용하는 것이 아니라 전체 페이지에 적용한다면 사용자는 사이트를 훨씬 빠르게 돌아다닐 수 있을겁니다.

이러한 방법을 적절하게 활용하면 페이지가 넘어갈 때 흰 화면 대신 적절한 로딩 화면을 보여줄 수도 있습니다.

![흰 화면 대신 로딩 화면을 보여준 후 페이지 이동이 되는 thepin.ch](thepinch-loading-screen.gif)

서버와 클라이언트가 같은 뷰 템플릿 파일을 공유해서 사용한다면 이러한 구현을 더욱 손쉽게 할 수 있습니다.

하지만 Django를 사용한다면 공통의 템플릿을 사용하기 까다로워 각각의 템플릿을 만드는 경우가 많습니다.

이렇게 서버와 브라우저의 템플릿이 별도로 존재하고 내용에도 차이가 있는 Instagram 같은 사이트는 목록 페이지에서 상세화면을 눌렀을때와 상세화면으로 바로 갔을 때의 화면이 서로 다른걸 볼 수 있습니다.

![목록에서 눌렀을땐 팝업. 새로고침 하면 목록 사라짐](instagram-diff-client-server.gif)

Gatsby 같은 프레임워크는 개발자가 별도로 신경을 쓰지 않아도 기본적으로 모든 페이지의 링크를 가로채어 JavaScript로 화면을 교체하도록 구현되어있습니다. 


## 5. Server Side Rendering
동적으로 페이지를 변경하는 경향이 강해지면서 아예 서버에서는 JavaScript만 먼저 보낸 후 모든 페이지를 JavaScript에서 생성하여 제공하는 방식이 생겨났습니다.

[instagram.com/dlwlrma](https://instagram.com/dlwlrma) 같은 인스타그램의 사용자 페이지를 보면 페이지상에는 이미지들이 존재하지만 소스 코드 상에는 <img /> 태그가 없는것을 보실 수 있습니다.

![Instagram 이미지가 있는 화면 소스에 img 태그는 없어요](instagram-no-img-tag.png)

이러한 방식으로 개발한 웹사이트는 페이지의 HTML 코드만 보고 그 내용을 확인하기 어렵습니다.
이는 곧 검색엔진이 그 페이지의 내용을 알기 어렵다는 뜻이기도 하고 검색했을때 결과로 나올 확률이 낮아진다는 이야기 이기도 합니다.  
 
그래서 이 문제를 보완하기 위해 브라우저에서 JavaScript로 내용을 채우는 대신 동일한 방식으로 서버에서 내용을 채운 HTML을 미리 보내주는 Server Side Rendering을 많이 사용하게 되었습니다.  
이런 SSR을 지원하는 데에는 NodeJS 만한게 없습니다. 종종 SSR을 지원하는 프레임워크들이 있지만 구현을 살펴보면 내부적으로는 NodeJS를 사용하는게 대부분입니다.

Django 역시 이러한 [SSR을 지원하는 확장](https://github.com/markfinger/python-react)이 있습니다.
다만 네이티브로 지원하는 NodeJS나 좀 더 잘 통합되어있는 [ASP.NET](https://reactjs.net/) 에 비하면 아쉬움이 있습니다.


## 6. 타입 안정성
```
NameError: name '***' is not defined
```
```
AttributeError: 'NoneType' object has no attribute '***'
```
```
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```
이 세가지 오류는 Python 사용자들이 가장 흔하게 겪는 오류 유형일겁니다.

최근에 만들어진 프로그래밍 언어들은 이러한 오류가 발생하는것을 미연에 방지하기 위해 타입 시스템과 같은 여러 장치들이 마련되어있습니다. 
이런 타입 안정성을 미리 고려하여 설계된 최근의 언어로는 Kotlin, Swift, Typescript, Rust 등이 있습니다.

Python에도 최근 타입 힌팅 기능이 추가되었지만 강제성이 없을 뿐 아니라 타입 시스템도 상대적으로 빈약하며 도구 지원은 아직 매우 미비한 수준입니다.
현재는 [mypy](http://mypy-lang.org/)같은 프로그램을 실행하여 확인하거나 PyCharm 같은 개발 도구 상에서 미리 확인할 수 있습니다.  

거기에 Python은 문법이 처음부터 타입 시스템을 염두해 설계된것이 아니다 보니
최근 강한 정적 타입 언어들이 많은 추론을 통해 타입명 직접 써야 하는 경우가 많이 줄어든데 비해
Python에서 더 자주 타입명을 직접 써줘야 하는 아이러니가 발생하기도 합니다.

타입 시스템이 강력한 언어인 Kotlin으로 개발할 수 있는 [Ktor](https://ktor.io), Swift로 개발할 수 있는 [Vapor](https://vapor.codes/)같은 프레임 워크가 있습니다.
 

# Django를 쓰는 이유

## 1. 튼실한 기본 Admin 페이지
관리자 페이지는 많은 사용자에게 보여지진 않지만 많은 경우 사용자 페이지에 비해 더 많은 개발 시간이 필요하곤 합니다.  
하지만 Django에선 거의 시간을 들이지 않고도 **쓸 수 있는** 수준의 관리자 화면을 바로 가질 수 있습니다.
그리고 이 관리자 화면은 깊은 수준까지 Customize가 가능하여 여러 큰 사이트에서 실제로 사용하고 있습니다.
   
![Django Admin 스크린](django-admin.png)


## 2. 기본 보안
중요하지만 막상 구현하려면 손도 많이 가고 신경도 많이 들어가는 부분입니다. 
[Django는 제법 다양한 공격을 방지할 수 있는 방법들이 이미 구현되어 있습니다.](https://docs.djangoproject.com/en/2.1/topics/security/) 

각 기능들이 어떤 공격으로 부터 보호하는 것 인지는 차후에 다른 글에서 자세히 알아보겠습니다.
이러한 기능들이 처음 Django로 개발 하는 사람들을 당황하게 만들거나 번거롭게 만들기도 하지만 하나하나 살펴보면 각자 나름대로의 중요한 역할들을 하고 있습니다.  


## 3. 쉽고 편한 개발, 디버깅 환경  
### Django Debug Toolbar

[Django Debug Toolbar](https://github.com/jazzband/django-debug-toolbar)를 이용하면 현재 보고 있는 화면의 설정, 실행된 SQL과 SQL별 실행계획, 각 단계별로 걸린 시간 등을 보고 이를 통해 버그를 찾거나 최적화를 할 수 있습니다.

![Django Debug Toolbar 스크린샷](django-debug-toolbar.png)

### Django Extensions Debugger

[Django Extensions](https://github.com/django-extensions/django-extensions)의 runserver_plus를 이용하면 심지어 오류가 난 시점 부분부터 브라우저 상에서 바로 Python 코드를 실행할 수 있습니다.
 
![브라우저에서 오류난 지점부터 바로 코드 실행 gif](django-extensions-runserver.gif)

이 두가지 도구를 이용하는데 익숙해진다면 비슷한 도구가 없는 환경에서 개발하는 일이 매우 답답하게 느껴질겁니다. 


## 4. 다양한 확장, App
Django Extensions나 Django Debug Toolbar뿐 아니라
브라우저 상에서 i18n을 위한 .po파일을 바로 만들 수 있는 [Rosetta](https://github.com/mbi/django-rosetta),
RESTful한 API를 쉽게 만들 수 있게 해주는 [Django REST Framework](https://github.com/encode/django-rest-framework)
등 검색, 캐싱, 이미지 변환, CDN 지원 등등 [수 많은 유용한 확장들](https://djangopackages.org/)이 존재합니다.

![Rosetta](rosetta.png)

StackOverflow와 비슷한 질답 사이트를 만들 수 있는 [Askbot](https://askbot.com/),
프로그램에서 발생하는 오류를 수집하고 관리 할 수 있는 [Sentry](https://sentry.io/welcome/) 등 Django를 기반으로 만든 프로그램도 많이 존재 합니다.
 

## 5. 거대한 커뮤니티
프레임워크를 사용한다는 그저 그 기능을 사용하는 것 뿐 아니라 그것을 사용하는 사람들의 사회에 속한다는것을 뜻합니다.

Django는 이 글에서 비교 대상으로 삼았던 새로나온 프레임워크들과 비교하면 사용자 수가 매우 많은 편에 속합니다.
커뮤니티를 통해 수 많은 확장들이 만들어지고 있으며 질문 답변 사이트에도 다양한 케이스의 문제와 해결책이 존재합니다.
강의도 많고 책도 많으며 심지어 번역된 책이나 한국어로 처음부터 쓰여진 책도 있습니다.

이렇게 많은 사람들과 공유하는 다양한 경험들은 개발을 하고 문제를 해결하는데 든든한 자산이 됩니다.


# 성능?
이유중에 성능이 없는것을 보셨을겁니다.

성능이란 말은 모호하고 실제로는 여러가지로 해석이 가능합니다.

요청이 들어오면 얼마나 빨르게 결과를 보내주는지 **속력**을 볼 수도 있고
한 서버에서 얼마나 많은 사용자를 수용할 수 있는지 **수용력**을 볼 수도 있습니다.

하지만 많은 경우 서버의 대수를 늘려서 수용력을 늘릴 수 있는 **확장성**이 있다면
많은 경우 속력과 수용력은 상대적으로 큰 이슈가 되지 않습니다. 
 
Django가 상대적으로 느린 편이긴 하지만 확장이 용이한 편이기 때문에 성능 때문에 다른 프레임워크를 선택할 일은 매우 드뭅니다. 

Django로 돌아가고 있는 Instagram보다 사용자가 많은 사이트를 만드신다면 고민해보세요.
(Instagram은 ORM, DBMS 접근 부분을 거의 새롭게 구현해야 했다고는 합니다.)
 

# 결론
Java + Spring이나 PHP + Laravel처럼
개발이 편하지도 않고
기능도 빈약하고
안전하지도 않고
빠르지도 않은 프레임워크가 널리 쓰이고 있는것에 비하면   

Django 충분히 좋아요.
