// Copyright 2018-present 650 Industries. All rights reserved.

#if __has_include(<ABI43_0_0EXNotifications/ABI43_0_0EXNotificationsEmitter.h>)

#import "ABI43_0_0EXScopedNotificationsEmitter.h"
#import "ABI43_0_0EXScopedNotificationsUtils.h"
#import "ABI43_0_0EXScopedNotificationSerializer.h"

@interface ABI43_0_0EXScopedNotificationsEmitter ()

@property (nonatomic, strong) NSString *scopeKey;

@end

@interface ABI43_0_0EXNotificationsEmitter (Protected)

- (NSDictionary *)serializedNotification:(UNNotification *)notification;
- (NSDictionary *)serializedNotificationResponse:(UNNotificationResponse *)notificationResponse;

@end

@implementation ABI43_0_0EXScopedNotificationsEmitter

- (instancetype)initWithScopeKey:(NSString *)scopeKey
{
  if (self = [super init]) {
    _scopeKey = scopeKey;
  }
  
  return self;
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  if ([ABI43_0_0EXScopedNotificationsUtils shouldNotification:response.notification beHandledByExperience:_scopeKey]) {
    [super userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  } else {
    completionHandler();
  }
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  if ([ABI43_0_0EXScopedNotificationsUtils shouldNotification:notification beHandledByExperience:_scopeKey]) {
    [super userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
  } else {
    completionHandler(UNNotificationPresentationOptionNone);
  }
}

- (NSDictionary *)serializedNotification:(UNNotification *)notification
{
  return [ABI43_0_0EXScopedNotificationSerializer serializedNotification:notification];
}

- (NSDictionary *)serializedNotificationResponse:(UNNotificationResponse *)notificationResponse
{
  return [ABI43_0_0EXScopedNotificationSerializer serializedNotificationResponse:notificationResponse];
}

@end

#endif
