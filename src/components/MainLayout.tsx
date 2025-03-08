import React, { useState, useEffect } from "react";
import {
  Layout,
  Select,
  Typography,
  Switch,
  Space,
  Divider,
  Dropdown,
  Button
} from "antd";
import { BulbOutlined, CodeOutlined, MenuOutlined } from "@ant-design/icons";
import { useSyntaxTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const {
    themeName,
    setThemeName,
    availableThemes,
    isDarkMode,
    toggleAppTheme
  } = useSyntaxTheme();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 890);
  const [menuOpen, setMenuOpen] = useState(false);

  // Отслеживаем изменение размера окна
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 890);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Обработчик для предотвращения закрытия меню при клике внутри Select
  const handleSelectClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  // Обработчик для состояния открытия/закрытия меню
  const handleMenuOpenChange = (open: boolean) => {
    setMenuOpen(open);
  };

  // Обработчик изменения темы подсветки кода
  const handleSyntaxThemeChange = (value: any) => {
    setThemeName(value);
  };

  return (
    <Layout className="site-layout">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          color: "white"
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Title
            level={4}
            style={{
              margin: 0,
              padding: 0,
              color: "white",
              fontWeight: 500
            }}
            className="header-title"
          >
            Справочник Frontend разработчика
          </Title>
        </Link>

        {/* Элементы управления темами */}
        {isMobile ? (
          // Мобильная версия с выпадающим меню
          <Dropdown
            menu={{
              items: [
                {
                  key: "theme",
                  label: (
                    <Space>
                      <BulbOutlined />
                      <Text>Тема:</Text>
                      <Switch
                        checked={isDarkMode}
                        onChange={toggleAppTheme}
                        checkedChildren="Тёмная"
                        unCheckedChildren="Светлая"
                      />
                    </Space>
                  )
                },
                {
                  type: "divider"
                },
                {
                  key: "syntax",
                  label: (
                    <div
                      onClick={handleSelectClick}
                      className="mobile-select-container"
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                          <CodeOutlined />
                          <Text>Подсветка кода:</Text>
                        </Space>
                        <Select
                          value={themeName}
                          onChange={handleSyntaxThemeChange}
                          style={{ width: "100%" }}
                          onClick={handleSelectClick}
                          dropdownStyle={{
                            zIndex: 1100,
                            position: "fixed"
                          }}
                          getPopupContainer={() => document.body}
                          listHeight={200}
                          popupMatchSelectWidth={false}
                          dropdownClassName="select-dropdown-override"
                        >
                          {availableThemes.map((theme) => (
                            <Option key={theme} value={theme}>
                              {theme}
                            </Option>
                          ))}
                        </Select>
                      </Space>
                    </div>
                  )
                }
              ]
            }}
            placement="bottomRight"
            trigger={["click"]}
            open={menuOpen}
            onOpenChange={handleMenuOpenChange}
            dropdownRender={(menu) => (
              <div
                className={`custom-dropdown ${
                  isDarkMode ? "dark-theme" : "light-theme"
                }`}
              >
                {menu}
              </div>
            )}
          >
            <Button
              type="text"
              icon={
                <MenuOutlined style={{ color: "white", fontSize: "20px" }} />
              }
            />
          </Dropdown>
        ) : (
          <Space
            split={
              <Divider
                type="vertical"
                style={{ background: "rgba(255,255,255,0.3)" }}
              />
            }
          >
            <Space>
              <BulbOutlined />
              <Text style={{ color: "white" }}>Тема:</Text>
              <Switch
                checked={isDarkMode}
                onChange={toggleAppTheme}
                checkedChildren="Темная"
                unCheckedChildren="Светлая"
              />
            </Space>

            <Space>
              <CodeOutlined />
              <Text style={{ color: "white" }}>Подсветка кода:</Text>
              <Select
                value={themeName}
                onChange={handleSyntaxThemeChange}
                style={{ width: 180 }}
              >
                {availableThemes.map((theme) => (
                  <Option key={theme} value={theme}>
                    {theme}
                  </Option>
                ))}
              </Select>
            </Space>
          </Space>
        )}
      </Header>
      <Content>
        <div className="site-layout-content">{children}</div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
