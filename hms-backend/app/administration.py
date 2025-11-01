class AdminTask(Base):
    __tablename__ = "admin_tasks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
