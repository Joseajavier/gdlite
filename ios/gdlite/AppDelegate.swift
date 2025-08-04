import UIKit
import FirebaseCore               // ← añadido
import FirebaseMessaging          // ← añadido
import UserNotifications          // ← añadido para permisos y delegado

import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder,
                   UIApplicationDelegate,
                   UNUserNotificationCenterDelegate,  // ← já declarado
                   MessagingDelegate                   // ← já declarado
{
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // ———————————— FIREBASE MESSAGING INICIO ————————————
    FirebaseApp.configure()
    Messaging.messaging().delegate = self
    UNUserNotificationCenter.current().delegate = self
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
      print("Push permissions granted: \(granted), error: \(String(describing: error))")
      if granted {
        DispatchQueue.main.async {
          application.registerForRemoteNotifications() // ← movido dentro de closure
        }
      }
    }
    // ———————————— FIREBASE MESSAGING FIN ————————————

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "gdlite",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  /// Convierte el token APNs (iOS) a FCM token para el registro
  func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    // Asigna el token APNs a Firebase y muestra en hex
    Messaging.messaging().apnsToken = deviceToken
    let hexToken = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("✅ APNs device token: \(hexToken)")
  }

  /// Error al registrar en APNs
  func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("❌ Falló registro APNs: \(error)")
  }

  /// Se dispara cada vez que Firebase emite un nuevo token de registro
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("✅ Nuevo FCM token: \(String(describing: fcmToken))")
  }

  // MARK: – UNUserNotificationCenterDelegate

  // Muestra notificaciones en foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.banner, .sound, .badge])
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
