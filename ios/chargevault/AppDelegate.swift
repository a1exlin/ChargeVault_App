import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, RCTBridgeDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
    let rootView = RCTRootView(bridge: bridge!, moduleName: "chargevault", initialProperties: nil)

    let rootViewController = UIViewController()
    rootViewController.view = rootView

    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.window?.rootViewController = rootViewController
    self.window?.makeKeyAndVisible()

    return true
  }

  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
